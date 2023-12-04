const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {{ persons }.persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => removePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
