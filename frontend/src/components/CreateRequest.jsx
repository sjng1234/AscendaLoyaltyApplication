import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Import Axios

import RequestTemplate from "./RequestTemplate";

function CreateRequest() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [permission, setPermission] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [seletedTemplateIndex, setSelectedTemplateIndex] = useState();
    const role = JSON.parse(localStorage.getItem("role"));

    const fetchData = async () => {
        try {
            const company = localStorage.getItem("selectedCompany");
            if (company) {
                setSelectedCompany(company);
            }

            let url = `http://localhost:8000/api/maker-checker/permission/?role=${role}`;
            const response = await axios.get(url, {
                withCredentials: true,
            });
            setPermission(response.data);

            if (response.data[0] && response.data[0].approved_actions) {
                const actions = response.data[0].approved_actions;

                const templatesPromises = actions.map((action) => {
                    const templateUrl = `http://localhost:8000/api/maker-checker/templates/?uid=${action}`;
                    return axios.get(templateUrl, {
                        withCredentials: true,
                    });
                });

                const templatesData = await Promise.all(templatesPromises);
                setTemplates(templatesData.map((template) => template.data));

                const dropdownOptions = templatesData.map(
                    (template) => template.data[0].type
                );
                setDropdownOptions(dropdownOptions);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleButtonClick = (index, state) => {
        setSelectedTemplate(state);
        setSelectedTemplateIndex(index);
        setIsOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle create request form submit
    const handleFormSubmit = (formData) => {
        // TODO Form validation here
        console.log("Form data: ", formData);
        const url = "http://localhost:8000/api/maker-checker/approval/create";
        axios
            .post(url, formData, {
                withCredentials: true,
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }
    return (
        <div>
            <div className="relative inline-block text-left bg-slate-600">
                {/* Button */}
                <button
                    onClick={toggleDropdown}
                    className="px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                    {selectedTemplate || "Select an action."}
                </button>
                {isOpen && (
                    <div className="right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                        >
                            {dropdownOptions.map((name, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleButtonClick(index, name)}
                                    className="block px-4 py-2 text-sm text-gray-700"
                                    role="menuitem"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            {seletedTemplateIndex !== undefined && (
                <RequestTemplate 
                    requestDetail={templates[seletedTemplateIndex][0]} 
                    onSubmit={ handleFormSubmit} 
                    selectedCompany={selectedCompany}/>
            )}
        </div>

    );
}

export default CreateRequest;