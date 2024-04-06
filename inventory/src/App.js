// Updated App.js

import React, { useState,useEffect } from 'react';
import Webcam from 'react-webcam';
import InventoryList from './components/InventoryList';
import './App.css';
import fridgeImg from './images/fridge.jpg';


function App() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
      'image1.jpg',
      'image2.jpg',
      'image3.jpg'
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);
  
    const [showContent, setShowContent] = useState(false);
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const contentHeight = document.body.scrollHeight;
  
      // Calculate the threshold for showing content
      const threshold = contentHeight - windowHeight - 200; // Adjust the threshold as needed
  
      // Toggle showContent state based on scroll position
      if (scrollPosition > threshold) {
        setShowContent(true);
      } else {
        setShowContent(false);
      }
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
  const [inventory, setInventory] = useState(() => {
    const storedInventory = localStorage.getItem('inventory');
    return storedInventory ? JSON.parse(storedInventory) : [
      { id: 1, name: 'Apple', amount: 2, spent: '$2', expiryDate: '15 Apr 2024', status: 'Not Expired' },
      // Add other initial items here
    ];
  });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    amount: 0,
    spent: '',
    expiryDate: '',
    status: ''
  });

  useEffect(() => {
    // Load inventory from local storage when component mounts
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
  }, []);

  fetch('/api/data', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });

  useEffect(() => {
    // Save inventory to local storage whenever it changes
    localStorage.setItem('inventory', JSON.stringify(inventory));
    console.log("Inventory saved to local storage:", inventory);
  }, [inventory]);
  const webcamRef = React.useRef(null);

  const toggleAddPopup = () => {
    setShowAddPopup(!showAddPopup);
  };
  const toggleScanPopup = () => {
    setShowScanPopup(!showScanPopup);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    const newInventoryItem = { id: inventory.length + 1, ...newItem };
    setInventory([...inventory, newInventoryItem]);
    setNewItem({
      name: '',
      amount: 0,
      spent: '',
      expiryDate: '',
      status: ''
    });
    setShowAddPopup(false);
  };

  const handleScanItem = () => {
    // Capture picture from webcam
    const imageSrc = webcamRef.current.getScreenshot();
    // Handle captured image (e.g., save it)
    console.log(imageSrc);
    // Close scan popup
    setShowScanPopup(false);
  };

  const [msg, setMsg] = useState('');
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const [msg1, setMsg1] = useState('');
  const [file1, setFile1] = useState(null);
  const [imgSrc1, setImgSrc1] = useState('');
  const [extractedText1, setExtractedText1] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      setImgSrc(data.imgSrc);
      setExtractedText(data.extracted_text);
      setMsg('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg('Failed to upload image');
    }
  };
  
  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleUpload2 = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file1', file1);

    try {
      const response = await fetch('/pred', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log(data);
      setImgSrc1(data.imgSrc1);
      setExtractedText1(data.extracted_text1);
      setMsg1('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg1('Failed to upload image');
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${fridgeImg})` }}>
      {/* <div className='backgroundOverlay'></div> */}
      <div className="toolbar">
        <button onClick={() => console.log("Information clicked")}>Information</button>
        <button onClick={() => console.log("Check your Savings clicked")}>Check your Savings</button>
        <button onClick={() => console.log("Recipes clicked")}>Recipes</button>
      </div>
      <header>Your Fridge</header>
      <InventoryList inventory={inventory} />
      <div className="actions">
        <button onClick={toggleAddPopup}>Add</button>
        <button onClick={toggleScanPopup}>Scan</button>

        {/* Add Popup */}
        {showAddPopup && (
          <div className="popup large-popup">
            <h2>Add New Item</h2>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" name="name" value={newItem.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input type="number" name="amount" value={newItem.amount} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Spent:</label>
              <input type="text" name="spent" value={newItem.spent} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Expiry Date:</label>
              <input type="text" name="expiryDate" value={newItem.expiryDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <input type="text" name="status" value={newItem.status} onChange={handleInputChange} />
            </div>
            <div className="form-actions">
              <button onClick={handleAddItem}>Save</button>
              <button onClick={toggleAddPopup}>Cancel</button>
            </div>
          </div>
        )}

        {/* Scan Popup */}
        {showScanPopup && (
          <div className="popup">
            <h2>Scan Item</h2>
            {/* Camera component */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
            />
            <button onClick={handleScanItem}>Save</button>
            <button onClick={toggleScanPopup}>Cancel</button>
          </div>
        )}

        {/* Other components like buttons for import/export here */}
      </div>
      <div>
      {msg && <h1>{msg}</h1>}
      <h1>Upload new File</h1>
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <p>
          <input type="file" name="file" onChange={handleFileChange} />
          <input type="submit" value="Upload" />
        </p>
      </form>
      <h1>Result:</h1>
      {imgSrc && <img src={imgSrc} alt="Uploaded" />}
      {extractedText ? (
        <p>
          The extracted text from the image above is: <b>{extractedText}</b>
        </p>
      ) : (
        <p>The extracted text will be displayed here</p>
      )}
    </div>
    <div>
      {msg1 && <h1>{msg1}</h1>}
      <h1>Upload new File</h1>
      <form onSubmit={handleUpload2} encType="multipart/form-data">
        <p>
          <input type="file" name="file1" onChange={handleFileChange1} />
          <input type="submit" value="Upload" />
        </p>
      </form>
      <h1>Result:</h1>
      {imgSrc1 && <img src={imgSrc1} alt="Uploaded" />}
      {extractedText1 ? (
        <p>
          The extracted text from the image above is: <b>{extractedText1}</b>
        </p>
      ) : (
        <p>The extracted text will be displayed here</p>
      )}
    </div>
    </div>
    
  );
}

export default App;
