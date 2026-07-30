import React from "react"
import { View, Text } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useGetAppointmentByIdQueryOptions, useEditAppointmentMutationOptions } from "@/lib/query-options/appointments/appointments"
import Input from "@/components/Input"
import { useForm, Controller } from "react-hook-form"

type AppointmentForm = {
  date: string
  start_time: string
  end_time: string
  type: string
  status: string
  notes?: string
  meeting_url?: string
}

function EditAppointmentPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: appointment, isLoading } = useGetAppointmentByIdQueryOptions(id)

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<AppointmentForm>({
    defaultValues: {
      date: "",
      start_time: "",
      end_time: "",
      type: "",
      status: "",
      notes: "",
      meeting_url: "",
    },
  })

  return (
    <View>
      <Text>{appointment?.client.full_name}</Text>
      <View>
        <Text>Date</Text>
        {/* <Input value={appointment?.date} /> */}
      </View>
    </View>
  )
}

export default EditAppointmentPage
