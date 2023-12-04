import { useEffect, useState } from 'react';

import personsService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personsService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (newName === '') return alert('Please enter a name');
    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const changedPerson = { ...person, number: newNumber };
        personsService
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) => (person.id !== returnedPerson.id ? person : returnedPerson))
            );
            setNewName('');
            setNewNumber('');
            notify(`Updated ${returnedPerson.name}`, 'success');
          })
          .catch((error) => {
            notify(error.response.data.error, 'error');
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };
    personsService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        notify(`Added ${returnedPerson.name}`, 'success');
      })
      .catch((error) => {
        notify(error.response.data.error, 'error');
      });
  };

  const removePerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          notify(`Deleted ${person.name}`, 'success');
        })
        .catch((error) => {
          notify(`The person '${person.name}' was already deleted from server`, 'error');
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const notify = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const filteredPersons = persons.filter(
    (person) =>
      person.name.toLowerCase().includes(filter.toLowerCase()) || person.number.includes(filter)
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
