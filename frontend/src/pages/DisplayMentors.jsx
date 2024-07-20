import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const DisplayMentors = () => {
  const location = useLocation();
  const { state } = location;
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (state?.skill) {
      // Replace with your actual backend endpoint
      const apiUrl = `http://localhost:3001/users/${state.skill}`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setMentors(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching mentors:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [state?.skill]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Mentors in {state?.skill}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mentors.map((mentor, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={mentor.profileImage}
              alt={`${mentor.fname} ${mentor.lname}`}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">
              {mentor.fname} {mentor.lname}
            </h2>
            <p className="text-gray-600 mb-4">{mentor.category}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => window.location.href = 'https://mentorlink.in/#/signup'}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayMentors;
