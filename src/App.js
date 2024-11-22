import React, { useState } from 'react';
import Select from 'react-select';
import './Style.css'

function App() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    // const [selectedOptions, setSelectedOptions] = useState([]);
    const [filteredResponse, setFilteredResponse] = useState(null);

    // Update the document title with roll number
    document.title = "ABCD123";

    const dropdownOptions = [
        { value: 'alphabets', label: 'Alphabets' },
        { value: 'numbers', label: 'Numbers' },
        { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
    ];

    const handleSubmit = async () => {
        try {
            // Validate JSON input
            let parsedInput;
            try {
                parsedInput = JSON.parse(jsonInput);
            } catch (e) {
                setError('Invalid JSON format.');
                return;
            }

            // Send POST request to backend
            const res = await fetch('https://backend-test-p.netlify.app/bfhl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedInput),
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data from the backend.');
            }

            const data = await res.json();
            setResponse(data);
            setError(null);
            setFilteredResponse(null); // Reset filtered response
        } catch (err) {
            setError(err.message);
            setResponse(null);
        }
    };

    const handleDropdownChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions);

        // Filter response based on selected dropdown options
        if (response) {
            const filteredData = {};
            selectedOptions.forEach(option => {
                filteredData[option.value] = response[option.value];
            });
            setFilteredResponse(filteredData);
        }
    };

    return (
        <div className='home' style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1 >Roll-Number: </h1>
            <label for="json</input>"></label>
  
            <input type="text" className='input' id="json" name="json"
                rows="10"
                cols="50"
                placeholder="Enter JSON input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
            />
            <br />
            <button className='submit-btn' onClick={handleSubmit} style={{ margin: '10px 0' }}>
                Submit
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {response && (
                <div>
                    <h2>Response:{document.title = 'ABCD123'}</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>

                    <h3>Select Fields to Display</h3>
                    <Select
                        options={dropdownOptions}
                        isMulti
                        onChange={handleDropdownChange}
                        placeholder="Select fields..."
                    />

                    {filteredResponse && (
                        <div>
                            <h2>Filtered Response:</h2>
                            <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
