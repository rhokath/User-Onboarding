import React, {useState, useEffect} from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import axios from "axios";

const UserForm = ({values, errors, touched, handleSubmit, status}) => {
    const [users, setUsers]= useState([]);
    useEffect(()=> {
        if(status){
            setUsers([...users, status])
        }
    }, [status])
    return(
        <div className="form-container">
            <h1>User</h1>
            <Form>
                <div>
                    <Field type="text" name="name" placeholder="name"/>
                    {touched.name && errors.name && (<p className="error">{errors.name}</p>)}
                </div>
                <div>
                    <Field type="email" name="email" placeholder="email"/>
                    {touched.email && errors.email && (<p className="error">{errors.email}</p>)}
                </div>
                <div>
                    <Field type="password" name="password" placeholder="password"/>
                    {touched.password && errors.password && (<p className="error">{errors.password}</p>)}
                </div>
                <label className="check-box-container">
                    Accept  Terms of Service
                    <Field type="checkbox" name="tos" checked={values.tos}/>
                    <span className="checkmark"/>
                </label>
                <button type="submit">Submit</button>
            </Form>
            {users.map(user => (<p key={user.id}>{user.name}</p>))}
        </div>
    )
}

const FormikUserForm = withFormik({
    mapPropsToValues(values){
        return {
            name: values.name || '',
            email: values.email || '',
            password: values.password || '',
            tos: values.tos || false
        }
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email("email not valid").required("email is required"),
        password: Yup.string().min(6, "password must be at least 6 characters").required("password is required"),
        tos: Yup.bool().required()
    }),
    handleSubmit(values, {setStatus, resetForm, setErrors}){
        console.log(values);
        if(values.email ==="waffle@syrup.com"){
            setErrors({email: "That email is already taken"});
        } else{
            axios.post(' https://reqres.in/api/users',values)
                .then(res => {
                    console.log("this is my response", res.data)
                    setStatus(res.data)
                    resetForm();
            
                })
                .catch(err => console.log("there is an error", err.response))
        }
    }

})(UserForm)

export default FormikUserForm;