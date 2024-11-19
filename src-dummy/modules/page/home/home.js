// import Element from 'app/element';

// import { track } from 'lwc';
// // LightningElement
// export default class Home extends Element {
//     @track hasFields = false; // To track if fields are available
//     @track previewFields = []; // To store the fetched fields
//     @track jsonData = [];

//     // connectedCallback() {
//     //     if (import.meta.env.SSR) {
//     //         // run code on the server
//     //         console.log('Server Render < < < < < < <')
//     //         // this.fetchFields();
//     //     } else {
//     //         // run code on the client
//     //         console.log('Client Render < < < < < < <')
//     //     }
//     // }
//     connectedCallback() {
//         console.log('check <><><><><><><><>')
//         this.fetchFields();
//     }

// fetchFields() {
//     const randomId = '670fa3db43d3fc822744d210'; // Replace with the actual ID you want to use
//     const apiUrl = `http://localhost:3000/api/v1/template/${randomId}`;

//     fetch(apiUrl)
//         .then(response => {
//             console.log(response)
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             console.log(response, 'here the res after json parse')
//             return response.json();
//         })
//         .then(data => {
//             this.jsonData = JSON.parse(data.jsonTemp)

//             if (this.jsonData.length > 0) {
//                 this.parseJsonToFields();
//             }

//             this.hasFields = this.jsonData.length > 0; // Set hasFields based on the fetched data
//             console.log(this.previewFields, 'here is the preview fields');
//         })
//         .catch(error => {
//             console.log('Error', error.message, 'error');
//         });
// }

//     parseJsonToFields() {
//         this.previewFields = [];
//         this.previewSections = [];
//         let currentSection = null;
//         let i=0;
//         this.jsonData.forEach(field => {
//             console.log('in Loop <<<<<<<<', i++)
//             if(!("name" in field)) {
//                 field["name"] = `${field["label"]}-${field["type"]}-${i++}`
//             }
//             if (field.type === 'section') {
//                 currentSection = {
//                     label: field.label,
//                     name: field.name,
//                     fields: [],
//                     repeat: field.repeat
//                 };
//                 this.previewSections.push(currentSection);
//                 this.previewFields.push(currentSection); // Add section to main array
//             } else {
//                 const parsedField = this.parseField(field);
//                 if (currentSection && field.inSection) {
//                     currentSection.fields.push(parsedField);
//                 }
//                 this.previewFields.push(parsedField); // Always add to main array
//             }
//         });
//     }

//     parseField(field) {
//         console.log("in Pare Field <<><><<<<< <<<<")
//         const type = this.getFieldType(field);
//         const parsedField = {
//             label: field.label,
//             name: field.name,
//             type: type,
//             required: field.required,
//             options: field.values,
//             value: field.value || '',
//             isStandardInput: ['text', 'number', 'email', 'tel', 'url', 'password', 'date', 'time', 'datetime', 'file', 'color', 'range'].includes(type),
//             isTextarea: type === 'textarea',
//             isCombobox: type === 'combobox',
//             isRadioGroup: type === 'radio-group',
//             isCheckboxGroup: type === 'checkbox-group',
//             isButton: type === 'button',
//             isHeader: type === 'header'
//         };
//         console.log('Parsed field:', JSON.stringify(parsedField, null, 2));
//         return parsedField;
//     }

//     getFieldType(field) {

//         console.log("In Get Field Type <<<<>><><<><<<<<<<< <<<<<<")

//         switch (field.type) {
//             case 'header':
//                 return 'header'
//             case 'text':
//                 return field.subtype || 'text';
//             case 'textarea':
//                 return 'textarea';
//             case 'number':
//                 return 'number';
//             case 'email':
//                 return 'email';
//             case 'tel':
//                 return 'tel';
//             case 'url':
//                 return 'url';
//             case 'password':
//                 return 'password';
//             case 'date':
//                 return 'date';
//             case 'time':
//                 return 'time';
//             case 'datetime':
//                 return 'datetime';
//             case 'select':
//                 return 'combobox';
//             case 'checkbox':
//                 return 'checkbox';
//             case 'radio':
//                 return 'radio-group';
//             case 'file':
//                 return 'file';
//             case 'hidden':
//                 return 'hidden';
//             case 'color':
//                 return 'color';
//             case 'range':
//                 return 'range';
//             case 'button':
//                 return 'button';
//             default:
//                 return 'text';
//         }
//     }

//     closeModal() {
//         // Logic to close the modal
//     }

//     handleFieldChange(event) {
//         // Logic to handle field changes
//     }

//     handleButtonClick(event) {
//         // Logic to handle button clicks
//     }
// }



import Element from 'app/element';
import axios from 'axios';

import { track } from 'lwc';
// import { track } from 'lwc';

export default class Home extends Element {
    @track jsonData;
    @track previewFields = [];
    @track previewSections = [];
    // @api JsonFromScreenFlow;

    @track currentPage = 1;
    @track totalPages = 1;
    @track progressSteps = [];
    @track progressPercentage = 0;
    @track toast = {};
    @track uid = null;
    pageSize = 3;

    connectedCallback() {
        // if (this.JsonFromScreenFlow) {
        this.jsonData = this.JsonFromScreenFlow;
        this.fetchFields()
        // this.parseJsonData(); 
        // } else {
        // console.log('JsonFromScreenFlow is empty');
        // }
    }

    fetchFields() {
        let queryParams = new URLSearchParams(window.location.search);
        this.uid = queryParams.get('ceif');

        // const randomId = '670fa3db43d3fc822744d210'; // Replace with the actual ID you want to use
        const apiUrl = `http://13.202.250.26:3000/api/v1/template/${this.uid}`;

        fetch(apiUrl)
            .then(response => {
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response, 'here the res after json parse')
                return response.json();
            })
            .then(data => {
                this.jsonData = JSON.parse(data.jsonTemp)

                if (this.jsonData.length > 0) {
                    this.parseJsonToFields(this.jsonData);
                }

                // this.hasFields = this.jsonData.length > 0; // Set hasFields based on the fetched data
                // console.log(this.previewFields, 'here is the preview fields');
            })
            .catch(error => {
                console.log('Error', error.message, 'error');
            });
    }

    // @wire(CurrentPageReference)
    // getStateParameters(currentPageReference) {
    //     if (currentPageReference && currentPageReference.state) {
    //         const jsonDataParam = currentPageReference.state.c__jsonData;
    //         if (jsonDataParam) {
    //             this.jsonData = decodeURIComponent(jsonDataParam);
    //             this.parseJsonData();
    //         } else {
    //             console.error('No JSON data received in URL parameters');
    //         }
    //     }
    // }

    parseJsonData() {
        if (this.jsonData) {
            try {
                const parsedData = JSON.parse(this.jsonData);
                // console.log('parsedData',JSON.stringify(parsedData));

                this.parseJsonToFields(parsedData);
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        } else {
            console.error('No JSON data to parse');
        }
    }

    parseJsonToFields(jsonData) {
        this.previewFields = [];
        this.previewSections = [];
        let currentSection = null;

        jsonData.forEach(field => {
            if (field.issection) {
                currentSection = {
                    label: field.fieldLabel,
                    name: field.id,
                    fields: [],
                    repeat: false
                };
                this.previewSections.push(currentSection);
                this.previewFields.push(currentSection);
            } else {
                const parsedField = this.parseField(field);
                // console.log('parsedField',JSON.stringify(parsedField));

                if (currentSection && field.parentSectionId === currentSection.name) {
                    currentSection.fields.push(parsedField);
                } else {
                    this.previewFields.push(parsedField);
                }
            }
        });

        this.calculatePagination();
        this.updateProgressIndicator();
    }

    parseField(field) {
        const type = this.getFieldType(field);
        return {
            label: field.fieldLabel,
            name: field.fieldName || field.id,
            type: type,
            required: field.isRequired,
            options: field.options || [],
            value: field.value || '',
            userInput: '',
            objectName: field.objectName,
            isStandardInput: ['text', 'number', 'email', 'tel', 'url', 'password', 'date', 'time', 'datetime', 'file', 'color', 'range'].includes(type),
            isTextarea: field.istextarea,
            isCombobox: type === 'combobox',
            isRadioGroup: type === 'radio-group',
            isCheckboxGroup: type === 'checkbox-group',
            isButton: type === 'button'
        };
    }

    getFieldType(field) {
        switch (field.fieldtype.toLowerCase()) {
            case 'text':
                return field.istextarea ? 'textarea' : 'text';
            case 'picklist':
                return 'combobox';
            case 'email':
                return 'email';
            case 'number':
                return 'number';
            case 'tel':
                return 'tel';
            case 'url':
                return 'url';
            case 'password':
                return 'password';
            case 'date':
                return 'date';
            case 'time':
                return 'time';
            case 'datetime':
                return 'datetime';
            case 'checkbox':
                return 'checkbox';
            case 'radio':
                return 'radio-group';
            case 'file':
                return 'file';
            case 'hidden':
                return 'hidden';
            case 'color':
                return 'color';
            case 'range':
                return 'range';
            case 'button':
                return 'button';
            default:
                return 'text';
        }
    }

    calculatePagination() {
        this.totalPages = Math.ceil(this.previewFields.length / this.pageSize);
        this.currentPage = 1;
    }

    get displayedFields() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = this.currentPage * this.pageSize;
        return this.previewFields.slice(start, end);
    }

    get hasFields() {
        return this.previewFields.length > 0;
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    get isSubmitDisabled() {
        // Disable Submit button if not on the last page or if required fields are not filled
        return (this.currentPage < this.totalPages) || !this.areRequiredFieldsFilled();
    }

    areRequiredFieldsFilled() {
        let allFilled = true;
        this.previewFields.forEach(field => {
            if (field.fields) {
                field.fields.forEach(subField => {
                    if (subField.required && (!subField.userInput || subField.userInput.trim() === '')) {
                        subField.errorMessage = 'This field is required.';
                        allFilled = false;
                    } else {
                        subField.errorMessage = '';
                    }
                });
            } else {
                if (field.required && (!field.userInput || field.userInput.trim() === '')) {
                    field.errorMessage = 'This field is required.';
                    allFilled = false;
                } else {
                    field.errorMessage = '';
                }
            }
        });
        return allFilled;
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateProgressIndicator();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateProgressIndicator();
        }
    }

    closeModal() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/lightning/n/FME_Landing'
            }
        });
    }

    get progressStyle() {
        return `width:${this.progressPercentage}%`;
    }

    updateProgressIndicator() {
        this.progressSteps = Array.from({ length: this.totalPages }, (_, index) => {
            const stepNumber = index + 1;
            return {
                id: `step-${stepNumber}`,
                class: `slds-progress__item ${stepNumber < this.currentPage ? 'slds-is-completed' : stepNumber === this.currentPage ? 'slds-is-active' : ''}`,
                markerClass: `slds-progress__marker ${stepNumber < this.currentPage ? 'slds-progress__marker_icon' : ''}`,
                completed: stepNumber < this.currentPage
            };
        });

        this.progressPercentage = ((this.currentPage - 1) / (this.totalPages - 1)) * 100;
    }

    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        // console.log(`Field Name: ${fieldName}, Field Value: ${fieldValue}`);
        const field = this.previewFields.find(f => f.name === fieldName || (f.fields && f.fields.find(subField => subField.name === fieldName)));
        try {
            if (field) {
                if (field.fields) {
                    const subField = field.fields.find(subField => subField.name === fieldName);
                    if (subField) {
                        subField.value = fieldValue;
                        subField.userInput = fieldValue;
                        // console.log(`Updated Sub Field: ${JSON.stringify(subField)}`);
                    }
                } else {
                    field.value = fieldValue;
                    field.userInput = fieldValue;
                    // console.log(`Updated Field: ${JSON.stringify(field)}`);
                }
            }
        } catch (error) {
            console.log('Error on handleInputChange', error.message);

        }
    }

    handleFormSubmit() {
        try {
            const userInputData = this.previewFields.flatMap(field => {
                if (field.fields) {
                    return field.fields.map(subField => ({
                        apiName: subField.name,
                        fieldtype: subField.type,
                        fieldLabel: subField.label,
                        objectName: subField.objectName,
                        userInput: subField.userInput || '',
                        isRequired: subField.required,
                    }));
                } else {
                    return {
                        apiName: field.name,
                        fieldtype: field.type,
                        fieldLabel: field.label,
                        objectName: field.objectName,
                        userInput: field.userInput || '',
                        isRequired: field.required,
                    };
                }
            }).filter(Boolean);
            console.log('userInputData', JSON.stringify(userInputData));

            userInputData.forEach(field => {
                if (field.fieldtype === 'DATETIME') {
                    const dateTime = new Date(field.userInput);
                    field.userInput = dateTime.toISOString().replace('Z', '');
                }
            });

            const userInputJson = JSON.stringify(userInputData);
            // console.log('Original User Input JSON:', userInputJson);

            // return processUserInput({ jsonInput: userInputJson })
            //     .then(result => {
            //         if (result.success) {
            //             console.log('Success:', result.message);
            //             this.showToast('Success', result.message, 'success');
            //         } else {
            //             console.error('Error:', result.error);
            //             this.showToast('Error', result.error, 'error');
            //         }
            //     })
            //     .catch(error => {
            //         console.error('Error calling Apex method:', error);
            //         this.showToast('Error', 'An error occurred while processing your request.', 'error');
            //     });


            // Form TESTINGGGGGG CODE ---------------- START
                const testData = {
                    "jsonData":  [
                    {
                      "apiName": "Name",
                      "userInput": userInputJson[2].userInput,
                      "object": "Account",
                      "refer": false
                    },
                    {
                      "apiName": "LastName",
                      "object": "Contact",
                      "userInput": userInputJson[1].userInput,
                      "refer": true,
                      "referToField": "AccountId",
                      "referToObj": "Account"
                    },
                    {
                      "apiName": "FirstName",
                      "object": "Contact",
                      "userInput": userInputJson[0].userInput,
                      "refer": true,
                      "referToField": "AccountId",
                      "referToObj": "Account"
                    }
                  ],
                    "templateId": "672b59c940316baba0e2a820"
                }
            // Form TESTINGGGGGG CODE ---------------- START



            axios.post("http://13.202.250.26:3000/api/v1/form_submit/", {...testData}).then(result => {
                if (result.data.success) {
                    console.log('Success:', result.data);
                    this.showToast('Success', result.data.message, 'success');
                } else {
                    console.error('Error:', result.data);
                    this.showToast('Error', result.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error calling Apex method:', error);
                this.showToast('Error', 'An error occurred while processing your request.', 'error');
            });


        } catch (error) {
            console.log('Error on handleFormSubmit', error.message);
            this.showToast('Error', 'An unexpected error occurred.', 'error');
        }
    }

    showToast(title, message, variant) {
        this.toast = { "active": true, title, message, variant }
        setTimeout(() => {
            this.toast = { ...this.toast, "active": false }
        }, 2000)
    }
}




