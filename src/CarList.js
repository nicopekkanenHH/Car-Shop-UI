import React, { useState, useEffect } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ brand: "", model: "", color: "", fuel: "", modelYear: "", price: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCarId, setEditCarId] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('https://car-rest-service-carshop.2.rahtiapp.fi/cars');
      // Muokataan autojen data sisältämään myös id-kentän URL:sta
      const carData = response.data._embedded?.cars.map(car => ({
        ...car,
        id: car._links.self.href.split('/').pop() // Otetaan ID URL:n lopusta
      })) || [];
      setCars(carData);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      alert("Failed to fetch cars. Please try again.");
    }
  };

  const addCar = async () => {
    try {
      await axios.post('https://car-rest-service-carshop.2.rahtiapp.fi/cars', newCar);
      fetchCars();
      setNewCar({ brand: "", model: "", color: "", fuel: "", modelYear: "", price: "" });
      setShowAddModal(false);
      alert("Car added successfully!");
    } catch (error) {
      console.error("Failed to add car:", error);
      alert("Failed to add car. Please try again.");
    }
  };

  const deleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`https://car-rest-service-carshop.2.rahtiapp.fi/cars/${carId}`);
        await fetchCars(); // Haetaan päivitetty lista
        alert("Car deleted successfully!");
      } catch (error) {
        console.error("Failed to delete car:", error);
        alert("Failed to delete car. Please try again.");
      }
    }
  };

  const editCar = (car) => {
    // Kopioidaan auton tiedot muokkauslomakkeelle
    setNewCar({
      brand: car.brand,
      model: car.model,
      color: car.color,
      fuel: car.fuel,
      modelYear: car.modelYear,
      price: car.price
    });
    setEditCarId(car.id);
    setShowEditModal(true);
  };

  const updateCar = async () => {
    try {
      if (editCarId) {
        await axios.put(`https://car-rest-service-carshop.2.rahtiapp.fi/cars/${editCarId}`, newCar);
        await fetchCars(); // Haetaan päivitetty lista
        resetForm();
        alert("Car updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update car:", error);
      alert("Failed to update car. Please try again.");
    }
  };

  const resetForm = () => {
    setNewCar({ brand: "", model: "", color: "", fuel: "", modelYear: "", price: "" });
    setEditCarId(null);
    setShowEditModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const columnDefs = [
    { headerName: "Brand", field: "brand", sortable: true, filter: true },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Color", field: "color", sortable: true, filter: true },
    { headerName: "Fuel", field: "fuel", sortable: true, filter: true },
    { headerName: "Year", field: "modelYear", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      width: 180,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => editCar(params.data)} 
            style={{ backgroundColor: "lightblue", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}
          >
            Edit
          </button>
          <button 
            onClick={() => deleteCar(params.data.id)} 
            style={{ backgroundColor: "lightcoral", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <header className="header">
        <h1 className="header-title">Car Shop</h1>
        <button className="add-car-button" onClick={() => setShowAddModal(true)}>Add Car</button>
      </header>

      <div className="ag-theme-alpine" style={{ height: 600, width: "100%", margin: "20px 0" }}>
        <AgGridReact
          rowData={cars}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          domLayout="autoHeight"
        />
      </div>

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowAddModal(false)}>&times;</span>
            <h3>Add New Car</h3>
            <input name="brand" placeholder="Brand" value={newCar.brand} onChange={handleInputChange} required />
            <input name="model" placeholder="Model" value={newCar.model} onChange={handleInputChange} required />
            <input name="color" placeholder="Color" value={newCar.color} onChange={handleInputChange} required />
            <input name="fuel" placeholder="Fuel" value={newCar.fuel} onChange={handleInputChange} required />
            <input name="modelYear" placeholder="Year" value={newCar.modelYear} onChange={handleInputChange} required type="number" />
            <input name="price" placeholder="Price" value={newCar.price} onChange={handleInputChange} required type="number" />
            <button onClick={addCar}>Add Car</button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowEditModal(false)}>&times;</span>
            <h3>Edit Car</h3>
            <input name="brand" placeholder="Brand" value={newCar.brand} onChange={handleInputChange} required />
            <input name="model" placeholder="Model" value={newCar.model} onChange={handleInputChange} required />
            <input name="color" placeholder="Color" value={newCar.color} onChange={handleInputChange} required />
            <input name="fuel" placeholder="Fuel" value={newCar.fuel} onChange={handleInputChange} required />
            <input name="modelYear" placeholder="Year" value={newCar.modelYear} onChange={handleInputChange} required type="number" />
            <input name="price" placeholder="Price" value={newCar.price} onChange={handleInputChange} required type="number" />
            <button onClick={updateCar}>Update Car</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarList;