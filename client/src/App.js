import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(0);
  const [phonebook, setPhonebook] = useState([]);
  const [newPhone, setNewPhone] = useState(0);

  // Function to add a new phone number
  const addNewNumber = () => {
    Axios.post('http://localhost:8080/add-phone', { name, phone })
      .then(() => {
        // After successfully adding a new number, fetch the updated phonebook
        Axios.get('http://localhost:8080/get-phone')
          .then(res => {
            setPhonebook(res.data.data.phoneNumbers);
          })
          .catch(error => {
            console.error('Error fetching phonebook data:', error);
          });
      })
      .catch(error => {
        console.error('Error adding new number:', error);
      });
  };

  // Function to update phone number
  const updatePhone = (id) => {
    Axios.put('http://localhost:8080/update-phone', { id, newPhone })
      .then(() => {
        // After successfully updating the phone number, fetch the updated phonebook
        Axios.get('http://localhost:8080/get-phone')
          .then(res => {
            setPhonebook(res.data.data.phoneNumbers);
          })
          .catch(error => {
            console.error('Error fetching phonebook data:', error);
          });
      })
      .catch(error => {
        console.error('Error updating phone number:', error);
      });
  };

  // Function to delete phone number
  const deletePhone = (id) => {
    Axios.delete(`http://localhost:8080/delete-phone/${id}`)
      .then(() => {
        // After successfully deleting the phone number, fetch the updated phonebook
        Axios.get('http://localhost:8080/get-phone')
          .then(res => {
            setPhonebook(res.data.data.phoneNumbers);
          })
          .catch(error => {
            console.error('Error fetching phonebook data:', error);
          });
      })
      .catch(error => {
        console.error('Error deleting phone number:', error);
      });
  };

  // Fetch phonebook data on component mount
  useEffect(() => {
    Axios.get('http://localhost:8080/get-phone')
      .then(res => {
        setPhonebook(res.data.data.phoneNumbers);
      })
      .catch(error => {
        console.error('Error fetching phonebook data:', error);
      });
  }, []);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '200px',
      backgroundColor:"orange",
      borderRadius: '50px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    phone: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #e0e0e0',
    },
    // ... more styles here ...
  };

  return (
    
    <div style={styles.container}>
      <div>
      <h1>PhoneBook List</h1>
      <label htmlFor="">Name: </label>
      <input type="text" onChange={e => setName(e.target.value)} /><br/><br/>
      <label htmlFor="">Phone: </label>
      <input type="number" onChange={e => setPhone(e.target.value)} /><br/><br/>
      <button onClick={addNewNumber}>Add New Number</button>
      </div>
      
      // Inside the map function where you're rendering the phonebook entries
{phonebook.map((val, key) => (
  <div key={key} className="phone">
    <h1>{val.name}</h1>
    <h1>{val.phone}</h1>
    {/* Input field for the new phone number */}
    <input 
      type="number" 
      placeholder='Update Phone...' 
      onChange={(e) => setNewPhone(e.target.value)} 
      style={{ display: val.isUpdating ? 'block' : 'none' }} // Toggle display based on isUpdating flag
    />
    {/* Update button */}
    <button 
      className="update-btn" 
      onClick={() => {
        // Toggle isUpdating flag to show/hide input field
        setPhonebook(prevState => prevState.map(item => 
          item._id === val._id ? { ...item, isUpdating: !item.isUpdating } : item
        ));
        // If isUpdating is true, update the phone number
        if (val.isUpdating) updatePhone(val._id);
      }}
    >
      {val.isUpdating ? 'Confirm' : 'Update'}
    </button>
    {/* Delete button */}
    <button className="delete-btn" onClick={() => deletePhone(val._id)}>Delete</button>
  </div>
))}

    </div>
  );
}

export default App;

