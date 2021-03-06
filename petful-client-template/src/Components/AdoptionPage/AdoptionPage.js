import React, { Component } from 'react';
import './AdoptionPage.css';
import config from '../../config';
import { unstable_batchedUpdates } from 'react-dom';

export default class AdoptionPage extends Component {
  state = {
    dog: {},
    cat: {},
    people: [],
    currentUser: null,
    petChoice: true
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/pets`).then((res) => res.json()).then((data) => {
      this.setState({
        dog: data.nextDog,
        cat: data.nextCat
      });
    });
    fetch(`${config.API_ENDPOINT}/people`).then((res) => res.json()).then((data) => {
      console.log(data);
      this.setState({
        people: data
      });
    });
  }

  onJoinQueue(e) {
    e.preventDefault();
    const name = { Name: e.target.name.value };
    const add = this.state.people;
    add.push(e.target.name.value);

    fetch(`${config.API_ENDPOINT}/people`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(name)
    });

    this.setState({
      people: add,
      currentUser: e.target.name.value
    });
    let thisPage = this;

    let interval = setInterval(function() {
      let petChoice;

      if (thisPage.state.petChoice === true) {
        petChoice = { type: 'cat' };
      } else {
        petChoice = { type: 'dog' };
      }

      thisPage.fetchCalls(petChoice);

      thisPage.setState({
        petChoice: !thisPage.state.petChoice
      });
      if (thisPage.state.people[1] === thisPage.state.currentUser) {
        clearInterval(interval);
      }
    }, 5000);

    e.target.name.value = '';
  }

  fetchCalls(petChoice) {
    fetch(`${config.API_ENDPOINT}/pets`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(petChoice)
    })
      .then(() => {
        return fetch(`${config.API_ENDPOINT}/pets`);
      })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          dog: data.nextDog,
          cat: data.nextCat
        });
        return fetch(`${config.API_ENDPOINT}/people`);
      })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          people: data
        });
      });
  }

  nextInLine() {
    const newNames = [
      { Name: 'Sasha Morales' },
      { Name: 'Trinity Hart' },
      { Name: 'Ariel Forrest' },
      { Name: 'Bob Pilterfrost' }
    ];
    const thisPage = this;
    let counter = 3;
    const add = this.state.people;
    add.push(newNames[counter].Name);

    let interval = setInterval(function() {
      fetch(`${config.API_ENDPOINT}/people`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(newNames[counter--])
      }).then(() => {
        thisPage.updatePeople();
      });
      if (counter === -1) {
        clearInterval(interval);
      }
    }, 5000);
  }

  updatePeople = () => {
    fetch(`${config.API_ENDPOINT}/people`).then((res) => res.json()).then((data) => {
      console.log(data);
      this.setState({
        people: data
      });
    });
  };

  adoptThePet(e) {
    e.preventDefault();

    let type = { type: e.target.id };

    this.fetchCalls(type);
    alert('Congratulations! You have adopted a new pet!');
  }

  render() {
    const people = this.state.people;
    const dog = this.state.dog;
    const cat = this.state.cat;
    if (people[0] === this.state.currentUser && people.length === 1) {
      this.nextInLine();
    }
    return (
      <div className='adoption'>
        <h1>Adopt a Pet</h1>
        <div className='pets-container'>
          <div className='dogBox'>
            <h2>Next Dog Up!</h2>
            <img src={dog.imageURL} alt={dog.description} />
            <li className='imageDesc'>
              <br />
              <em>"{dog.description}"</em>
            </li>
            <ul>
              <br />
              <li>Name: {dog.name}</li>
              <br />
              <li>Gender: {dog.gender}</li>
              <br />
              <li>Age: {dog.age} years old</li>
              <br />
              <li>Breed: {dog.breed}</li>
              <br />
              <li>Story: {dog.story}</li>
            </ul>
            {this.state.currentUser &&
            this.state.currentUser === people[0] && (
              <form id='dog'>
                <button id='dog' onClick={(e) => this.adoptThePet(e)}>
                  Adopt Me!
                </button>
              </form>
            )}
          </div>
          <div className='catBox'>
            <h2>Next Cat Up!</h2>
            <img src={cat.imageURL} alt={cat.description} />
            <li className='imageDesc'>
              <br />
              <em>"{cat.description}"</em>
            </li>
            <ul>
              <br />
              <li>Name: {cat.name}</li>
              <br />
              <li>Gender: {cat.gender}</li>
              <br />
              <li>Age: {cat.age} years old</li>
              <br />
              <li>Breed: {cat.breed}</li>
              <br />
              <li>Story: {cat.story}</li>
            </ul>
            {this.state.currentUser &&
            this.state.currentUser === people[0] && (
              <form id='cat'>
                <button id='cat' onClick={(e) => this.adoptThePet(e)}>
                  Adopt Me!
                </button>
              </form>
            )}
          </div>
        </div>
        <section className='adoptionQ'>
          <h3>In love yet? Join the queue below...</h3>
          <label>Adoption Queue</label>
          <ol>{people.map((person) => <li>{person}</li>)}</ol>
          <form onSubmit={(e) => this.onJoinQueue(e)}>
            <label>Name:</label>
            <input type='text' name='name' />
            <button>Join Queue</button>
          </form>
        </section>
      </div>
    );
  }
}
