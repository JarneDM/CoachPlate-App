import { useGetAppointmentsQueryOptions } from '@/lib/query-options/appointments/appointments'
import React from 'react'
import { View, Text } from 'react-native'

function Appointments() {
  const appointments = useGetAppointmentsQueryOptions()
  return (
    <View>
      <Text>Appointments</Text>
      {appointments.isLoading && <Text>Loading...</Text>}
      {appointments.isError && <Text>Error: {appointments.error.message}</Text>}
      {appointments.data && (
        <View>
          {appointments.data.map((appointment) => (
            <View key={appointment.id}>
              <Text>{appointment.client.full_name}</Text>
              <Text>{appointment.type}</Text>
              <Text>{appointment.date}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default Appointments
