import React from "react";
import Utils from "../../utils/Utils";
import Swal from "sweetalert2";
import {Button, Card, Form} from "react-bootstrap";
import Loading from "../loading/Loading";
import "./Site.scss";
import Select from "react-select";
import {connect} from "react-redux";

function mapStateToProps(state) {
    return {
        account: state.auth
    };
}

class Site extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelTokenSource: null,
            settings: []
        }
    }

    componentDidMount() {
        this.getSiteSettings();
    }

    componentWillUnmount() {
        if (this.state.cancelTokenSource) {
            this.state.cancelTokenSource.cancel('Operation canceled by the user.');
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.account.uuid !== this.props.account.uuid) {
            this.getSiteSettings();
        }
        return true;
    }

    getSiteSettings = () => {
        const cancelTokenSource = Utils.siteSettings('get', {}, response => {
            if (this.state.cancelTokenSource) {
                this.setState({
                    cancelTokenSource: null,
                    settings: response.data
                })
            }
        }, error => {
            console.log(error);
            this.setState({
                cancelTokenSource: null,
                settings: []
            })
        })
        this.setState({
            cancelTokenSource: cancelTokenSource
        })
    }
    handleSelect = (key, selecteds) => {
        let state = this.state;
        let field = state.settings[key];
        let value;
        if (field.type === 'multiSelect') {
            let valueArray = selecteds.map(selected => {
                return selected.value;
            });
            value = valueArray.join(',');
        } else {
            value = selecteds.value;
        }
        if (value === ',') {
            value = '';
        }
        if (value === '' && field.required === 1) {
            state[key] = {
                text: '请输入' + field.name,
                isInvalid: true,
                isValid: false,
            };
        }
        state.settings[key].value = value;
        this.setState(state);
    }
    handleChange = (event) => {
        console.log(event);
        let target = event.target;
        let state = this.state;
        let label;
        let id;
        let value;
        let required;

        switch (target.type) {
            case 'checkbox':
                value = target.value;
                id = target.id;
                let checkboxIdSplits = id.split('-');
                id = checkboxIdSplits[0];
                let checked = state.settings[id].value.split(',');
                let checkedIndex = checked.indexOf(value);
                if (checkedIndex !== -1) {
                    checked.splice(checkedIndex, 1);
                } else {
                    checked.push(value);
                }
                value = checked.join(',');
                if (value === ',') {
                    value = '';
                }
                target = target.parentNode;
                break;
            case 'radio':
                value = target.value;
                id = target.id;
                let radioIdSplits = id.split('-');
                id = radioIdSplits[0];
                target = target.parentNode;
                break;
            default:
                id = target.id;
                value = target.value.trim();
        }
        state.settings[id].value = value;
        required = state.settings[id].required;
        label = state.settings[id].name;
        let text = "";
        let isInvalid = false;
        let isValid = false;
        if (value === '' && required === 1) {
            text = '请输入' + label;
            isInvalid = true;
        } else {
            isValid = true;
        }
        state[id] = {
            text: text,
            isInvalid: isInvalid,
            isValid: isValid,
        };
        this.setState(state)
    }

    formSubmit = () => {
        let settings = this.state.settings;
        let data = {};
        for (let key in settings) {
            let setting = settings[key];
            if (setting.value === '' && setting.required === 1) {
                let state = this.state;
                state[key] = {
                    text: '请输入' + setting.name,
                    isInvalid: true,
                    isValid: false,
                };
                this.setState(state);
                return;
            }
            data[key] = setting.value
        }
        Utils.siteSettings('post', data, response => {
            console.log(response);
            Swal.fire({icon: 'success', text: '保存成功', showConfirmButton: false, timer: 3000})
        }, error => {
            console.log(error);
            Swal.fire({icon: 'success', text: '保存失败，请稍后重试', showConfirmButton: false, timer: 3000})
        })
    }

    render() {
        if (Utils.objectIsEmpty(this.state.settings)) {
            return (<Loading/>);
        } else {
            let formContent = [];
            for (let key in this.state.settings) {
                let setting = this.state.settings[key];
                let control = null;
                let options;
                let items = [];
                switch (setting.type) {
                    case 'textarea':
                        control = <Form.Control as="textarea" onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}/>
                        break;
                    case 'select':
                        options = JSON.parse(setting.options);
                        let selectedOption = [];
                        for (let key in options) {
                            let selectOption = {value: key, label: options[key]};
                            items.push(selectOption);
                            if (key === setting.value) {
                                selectedOption.push(selectOption)
                            }
                        }
                        control = <Select className="select-control" classNamePrefix="select-control" options={items} onChange={this.handleSelect.bind(this, setting.key)} value={selectedOption} placeholder=""/>
                        break;
                    case 'multiSelect':
                        options = JSON.parse(setting.options);
                        let multiSelectedValue = setting.value ? setting.value.split(',') : [];
                        let multiSelectedOption = [];
                        for (let key in options) {
                            let selectOption = {value: key, label: options[key]};
                            items.push(selectOption);
                            if (multiSelectedValue.indexOf(key) !== -1) {
                                multiSelectedOption.push(selectOption)
                            }
                        }
                        control = <Select className="select-control" classNamePrefix="select-control" options={items} isMulti onChange={this.handleSelect.bind(this, setting.key)} value={multiSelectedOption} placeholder=""/>
                        break;
                    case 'checkbox':
                        options = JSON.parse(setting.options);
                        let selected = setting.value.split(',');
                        for (let key in options) {
                            items.push(<Form.Check onChange={this.handleChange} inline key={key} value={key} label={options[key]} type="checkbox" id={setting.key + '-' + key} checked={selected.indexOf(key) !== -1}/>);
                        }
                        control = <div className="form-control">{items}</div>
                        break;
                    case 'radio':
                        options = JSON.parse(setting.options);
                        for (let key in options) {
                            items.push(<Form.Check onChange={this.handleChange} inline key={key} value={key} label={options[key]} type="radio" id={setting.key + '-' + key} checked={setting.value === key}/>);
                        }
                        control = <div className="form-control">{items}</div>
                        break;
                    case 'range':
                        options = JSON.parse(setting.options);
                        control = <Form.Control key={key} type="range" min={options.min} max={options.max} onChange={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}/>
                        break;
                    case 'input':
                    default:
                        control = <Form.Control onChange={this.handleChange} onBlur={this.handleChange} value={setting.value} isInvalid={this.state[setting.key] ? this.state[setting.key].isInvalid : false} isValid={this.state[setting.key] ? this.state[setting.key].isValid : false}/>
                        break;
                }
                let formGroup = null;
                let classNames = ['position-relative', 'mb-3'];
                let fieldState = this.state[setting.key];
                if (setting.type === 'radio' || setting.type === 'checkbox' || setting.type === 'select' || setting.type === 'multiSelect') {
                    classNames.push('custom-react-' + setting.type);
                    if (fieldState) {
                        if (fieldState.isInvalid) {
                            classNames.push('is-invalid');
                        }
                        if (fieldState.isValid) {
                            classNames.push('is-valid');
                        }
                    }
                    formGroup = <Form.Group key={setting.key} controlId={setting.key} className={classNames.join(' ')}>
                        <Form.Label>{setting.name}</Form.Label>
                        {control}
                        <div className="invalid-tooltip">请输入{setting.name}</div>
                        <Form.Text muted>{setting.description}</Form.Text>
                    </Form.Group>
                } else {
                    formGroup = <Form.Group key={setting.key} controlId={setting.key} className={classNames.join(' ')}>
                        <Form.Label>{setting.name}</Form.Label>
                        {control}
                        <Form.Control.Feedback type="invalid" tooltip>{fieldState ? fieldState.text : ''}</Form.Control.Feedback>
                        <Form.Text muted>{setting.description}</Form.Text>
                    </Form.Group>
                }
                formContent.push(formGroup);
            }

            return (
                <Card className="site-settings-container">
                    <Card.Body className="site-settings-table">
                        <Form noValidate>
                            {formContent}
                        </Form>
                    </Card.Body>
                    <Card.Footer className="site-settings-footer">
                        <Button variant="primary" type="submit" onClick={this.formSubmit}>保存</Button>
                    </Card.Footer>
                </Card>
            );
        }
    }
}

export default connect(mapStateToProps, null)(Site);