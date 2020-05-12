import React, {Fragment} from 'react';
import {
  SafeAreaView,
  TextInput,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Switch,
} from 'react-native';

import {Formik} from 'formik';
import * as yup from 'yup';

const StyledInput = ({label, formikProps, formikKey, ...rest}) => {
  const inputStyle = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3,
  };
  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyle.borderColor = 'red';
  }
  return (
    <FieldWrapper label={label} formikProps={formikProps} formikKey={formikKey}>
      <TextInput
        style={inputStyle}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  );
};

const StyledSwitch = ({label, formikProps, formikKey, ...rest}) => {
  const inputStyle = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3,
  };
  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyle.borderColor = 'red';
  }
  return (
    <FieldWrapper label={label} formikProps={formikProps} formikKey={formikKey}>
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={(value) => {
          formikProps.setFieldValue(formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  );
};

const FieldWrapper = ({children, label, formikProps, formikKey}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    {children}
    <Text style={styles.error}>
      {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
    </Text>
  </View>
);

const validationSchema = yup.object().shape({
  email: yup.string().label('Email').email().required(),
  password: yup
    .string()
    .label('Password')
    .required()
    .min(2, 'Seems a bit short')
    .max(12, 'Seems a bit long'),
  confirmPassword: yup
    .string()
    .label('Confirm Password')
    .required()
    .min(2, 'Seems a bit short')
    .max(12, 'Seems a bit long')
    .test('password-match', 'Password dont match', function (value) {
      return this.parent.password === value;
    }),
  agreeToTerms: yup
    .boolean()
    .label('Terms')
    .test('is-true', 'Must to terms to continue', (value) => value === true),
});

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeView}>
        <Formik
          initialValues={{
            email: '',
            password: '',
            agreeToTerms: false,
            confirmPassword: '',
          }}
          onSubmit={(values, actions) => {
            alert(JSON.stringify(values));
            setTimeout(() => {
              actions.setSubmitting(false);
            }, 100);
          }}
          validationSchema={validationSchema}>
          {(formikProps) => (
            <Fragment>
              <StyledInput
                label="Email"
                formikProps={formikProps}
                formikKey={'email'}
                placeholder="john@gmail.com"
                autoFocus
              />
              <StyledInput
                label="Password"
                formikProps={formikProps}
                formikKey={'password'}
                placeholder="password"
                secureTextEntry
              />
              <StyledInput
                label="Confirm Password"
                formikProps={formikProps}
                formikKey={'confirmPassword'}
                placeholder="confirm password"
                secureTextEntry
              />
              <StyledSwitch
                label="Agreeto Terms"
                formikProps={formikProps}
                formikKey="agreeToTerms"
              />

              {formikProps.isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Button title="submit" onPress={formikProps.handleSubmit} />
              )}
            </Fragment>
          )}
        </Formik>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeView: {
    marginTop: 90,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3,
  },
  error: {
    color: 'red',
  },
  inputContainer: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  label: {
    marginBottom: 3,
  },
});

export default App;
