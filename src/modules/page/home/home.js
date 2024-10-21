import Element from 'app/element';

import { track } from 'lwc';
// LightningElement
export default class Home extends Element {
    @track hasFields = false; // To track if fields are available
    @track previewFields = []; // To store the fetched fields
    @track jsonData = [];

    // connectedCallback() {
    //     if (import.meta.env.SSR) {
    //         // run code on the server
    //         console.log('Server Render < < < < < < <')
    //         // this.fetchFields();
    //     } else {
    //         // run code on the client
    //         console.log('Client Render < < < < < < <')
    //     }
    // }
    connectedCallback() {
        console.log('check <><><><><><><><>')
        this.fetchFields();
    }

    fetchFields() {
        const randomId = '670fa3db43d3fc822744d210'; // Replace with the actual ID you want to use
        const apiUrl = `http://localhost:3000/api/v1/template/${randomId}`;

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
                    this.parseJsonToFields();
                }

                this.hasFields = this.jsonData.length > 0; // Set hasFields based on the fetched data
                console.log(this.previewFields, 'here is the preview fields');
            })
            .catch(error => {
                console.log('Error', error.message, 'error');
            });
    }

    parseJsonToFields() {
        this.previewFields = [];
        this.previewSections = [];
        let currentSection = null;
        let i=0;
        this.jsonData.forEach(field => {
            console.log('in Loop <<<<<<<<', i++)
            if(!("name" in field)) {
                field["name"] = `${field["label"]}-${field["type"]}-${i++}`
            }
            if (field.type === 'section') {
                currentSection = {
                    label: field.label,
                    name: field.name,
                    fields: [],
                    repeat: field.repeat
                };
                this.previewSections.push(currentSection);
                this.previewFields.push(currentSection); // Add section to main array
            } else {
                const parsedField = this.parseField(field);
                if (currentSection && field.inSection) {
                    currentSection.fields.push(parsedField);
                }
                this.previewFields.push(parsedField); // Always add to main array
            }
        });
    }

    parseField(field) {
        console.log("in Pare Field <<><><<<<< <<<<")
        const type = this.getFieldType(field);
        const parsedField = {
            label: field.label,
            name: field.name,
            type: type,
            required: field.required,
            options: field.values,
            value: field.value || '',
            isStandardInput: ['text', 'number', 'email', 'tel', 'url', 'password', 'date', 'time', 'datetime', 'file', 'color', 'range'].includes(type),
            isTextarea: type === 'textarea',
            isCombobox: type === 'combobox',
            isRadioGroup: type === 'radio-group',
            isCheckboxGroup: type === 'checkbox-group',
            isButton: type === 'button',
            isHeader: type === 'header'
        };
        console.log('Parsed field:', JSON.stringify(parsedField, null, 2));
        return parsedField;
    }

    getFieldType(field) {

        console.log("In Get Field Type <<<<>><><<><<<<<<<< <<<<<<")

        switch (field.type) {
            case 'header':
                return 'header'
            case 'text':
                return field.subtype || 'text';
            case 'textarea':
                return 'textarea';
            case 'number':
                return 'number';
            case 'email':
                return 'email';
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
            case 'select':
                return 'combobox';
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

    closeModal() {
        // Logic to close the modal
    }

    handleFieldChange(event) {
        // Logic to handle field changes
    }

    handleButtonClick(event) {
        // Logic to handle button clicks
    }
}