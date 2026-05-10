import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";
import Input from "../Input";
type LoginProps = {
  email: string;
  password: string;
};

function Loginform() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (data: LoginProps) => {
    console.log(data);
  };
  return (
    <View>
      <Text>Login</Text>
      <View>
        <Text>Email:</Text>
        <Controller
          control={control}
          render={() => (
            <Input {...(register("email"), { required: true })} value={email} onChangeText={setEmail} placeholder="Enter your email" />
          )}
          name="email"
          rules={{ required: "Email is required" }}
        />
        {errors.email && <Text>{errors.email.message}</Text>}
      </View>
      <View>
        <Text>Password:</Text>
        <Controller
          control={control}
          render={() => (
            <Input
              {...(register("password"), { required: true })}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              type="password"
            />
          )}
          name="password"
          rules={{ required: "Password is required" }}
        />
        {errors.password && <Text>{errors.password.message}</Text>}
      </View>
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

export default Loginform;
