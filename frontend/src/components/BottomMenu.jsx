import { useEffect, useState } from "react";
import { initialMenuItems } from "../utils/data";
import { MenuItemButton } from "./MenuItemButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BottomMenu = () => {
  const [menuLabel, setMenuLabel] = useState("Main Menu");
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [previousMenuItems, setPreviousMenuItems] = useState([]);
  const [previousMenuLabel, setPreviousMenuLabel] = useState("");
  const [noMentorsFound, setNoMentorsFound] = useState(false);
  const [developmentMessage, setDevelopmentMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setMenuItems(menuItems);
  }, [menuLabel]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/users/categories"
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getBackendData = async (label) => {
    let menuItemsUrl;

    const menuItemsUrlLists = {
      "Search for a mentor": "http://localhost:3001/users/categories",
      "Assist on mentoring topics": "",
      "Course on mentoring": "",
    };

    if (menuItemsUrlLists[label] === "") {
      setDevelopmentMessage("This feature is still under development");
      setMenuItems([]);
      return;
    }

    if (menuItemsUrlLists[label]) {
      menuItemsUrl = menuItemsUrlLists[label];
    } else {
      const categories = await getCategories();

      if (categories.includes(label)) {
        menuItemsUrl = `http://localhost:3001/${label}/skills`;
      } else {
        navigate("/mentors", { state: { skill: label } });
        return;
      }
    }

    try {
      const response = await axios.get(menuItemsUrl);
      const data = response.data;
      if (data.length === 0) {
        setNoMentorsFound(true);
        setDevelopmentMessage("");
      } else {
        setNoMentorsFound(false);
        setDevelopmentMessage("");
        const menuItemsCollection = data.map((menuItem, index) => ({
          id: index + 1,
          label: menuItem,
        }));

        // Save current menu items and label
        setPreviousMenuItems(menuItems);
        setPreviousMenuLabel(menuLabel);
        setMenuItems(menuItemsCollection);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMenuItem = (label) => {
    setPreviousMenuItems(menuItems);
        setPreviousMenuLabel(menuLabel);
    setMenuLabel(label);
    getBackendData(label);
  };

  const goBack = () => {
    setMenuLabel(previousMenuLabel);
    setMenuItems(previousMenuItems);
    setNoMentorsFound(false);
    setDevelopmentMessage("");
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-300 p-4 m-4 rounded max-h-[600px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-2 text-center">{menuLabel}</h3>

      {developmentMessage ? (
        <div className="text-center text-red-500">{developmentMessage}</div>
      ) : noMentorsFound ? (
        <div className="text-center text-red-500">No mentors found</div>
      ) : (
        <div className="flex flex-col gap-2 text-custom-brown">
          {menuItems.map((menuItem) => (
            <MenuItemButton
              key={menuItem.id}
              name={menuItem.label}
              label={menuItem.label}
              onClick={() => {
                handleMenuItem(menuItem.label);
              }}
            />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded"
          onClick={goBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BottomMenu;
