import React, { Component } from 'react';
import axios from 'axios';



import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';
import { Button } from 'material-ui';

import { withRouter } from 'react-router-dom';
import config from './../../config';


import './registrieren.css';

class Registrieren extends Component {
    constructor(props) {
        super(props);


        this.state = {
            formData: {
                first_name: '',
                last_name: '',
                email: '',
                gender: '',
                password: '',
                repeatPassword: '',
                birth_year: '',
            },
            submited: false,

        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.formData.password) {
                return false;
            }
            return true;
        });
        /*ValidatorForm.addValidationRule('isEmailAvailable', (value) => {
            axios.post('/api/users/emailavailable', formDataClear)
                .then((response) => {
                    if (response.data == "ok") {
                        return true
                    } 
                    return false
            })
        });*/
    }

    handleInputChange(event) {
        const { formData } = this.state;
        formData[event.target.name] = event.target.value;
        this.setState({ formData });
    }


    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submited: true });

        let { repeatPassword, birth_year, ...formDataClear } = this.state.formData;

        formDataClear.birth_year = parseInt(birth_year);

        axios.post(config.URL + 'api/v1/users/', formDataClear, { headers: { 'Cache-Control': 'no-cache' } })
            .then((response) => {
                this.setState({ submited: false });
                this.props.history.push("/");
                this.props.handleLogin(response);
            })
            .catch((error) => {
                this.setState({ submited: false });
                console.log(error);
            })
    }

    render() {
        const { formData, submitted } = this.state;
        const possibleYears = [];
        const currentYear = new Date().getFullYear();
        for (let index = 0; index < 100; index++) {
            let year = currentYear - 17 - index;
            possibleYears.push(year);
        }


        return (
            <ValidatorForm
                onSubmit={this.handleSubmit}
                ref="form"
                debounceTime={500}
            >
                <h2>Erstelle neuen Nutzer</h2>
                <TextValidator
                    label="Email"
                    onChange={this.handleInputChange}
                    name="email"
                    validators={['required', 'isEmail']}
                    errorMessages={['Dieses Feld ist benötigt.', 'Ungültige E-Mail']}
                    value={formData.email}
                />
                <TextValidator
                    label="Password"
                    onChange={this.handleInputChange}
                    name="password"
                    type="password"
                    validators={['required', 'minStringLength:6']}
                    errorMessages={['Dieses Feld ist benötigt.', 'Password hat mindestens 6 Buchstaben.']}
                    value={formData.password}
                />
                <TextValidator
                    label="Repeat password"
                    onChange={this.handleInputChange}
                    name="repeatPassword"
                    type="password"
                    validators={['isPasswordMatch', 'required']}
                    errorMessages={['Passwörter unterschiedlich', 'Dieses Feld ist benötigt.']}
                    value={formData.repeatPassword}
                />
                <TextValidator
                    label="Vorname"
                    onChange={this.handleInputChange}
                    name="first_name"
                    validators={['required', 'minStringLength:2']}
                    errorMessages={['Dieses Feld ist benötigt.', 'Vorname hat mindestens zwei Buchstaben.']}
                    value={formData.first_name}
                />
                <TextValidator
                    label="Nachname"
                    onChange={this.handleInputChange}
                    name="last_name"
                    validators={['required', 'minStringLength:2']}
                    errorMessages={['Dieses Feld ist benötigt.', 'Nachname hat mindestens zwei Buchstaben.']}
                    value={formData.last_name}
                />

                <SelectValidator
                    name="gender"
                    label="Anrede"
                    size="1"
                    onChange={this.handleInputChange}
                    value={formData.gender}
                    validators={['required']}
                    errorMessages={['Dieses Feld ist benötigt.']}
                >
                    <option value="Frau">Frau</option>
                    <option value="Herr">Herr</option>
                </SelectValidator>
                <SelectValidator
                    name="birth_year"
                    size="1"
                    label="Geburtsjahr"
                    onChange={this.handleInputChange}
                    value={formData.birth_year}
                    validators={['required']}
                    errorMessages={['Dieses Feld ist benötigt.']}
                >
                    {possibleYears.map((ele) => {
                        return <option key={ele.toString()} value={ele.toString()}>{ele}</option>
                    })}
                </SelectValidator>


                <Button
                    variant="raised"
                    color="primary"
                    type="submit"
                    disabled={submitted}
                >
                    {
                        (submitted && 'Lädt')
                        || (!submitted && 'Absenden')
                    }
                </Button>
            </ValidatorForm>

        );
    }
}




export default withRouter(Registrieren);
