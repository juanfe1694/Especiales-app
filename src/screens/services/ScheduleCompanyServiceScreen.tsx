import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ScheduleCompanyServiceForm } from '../../components/services/ScheduleCompanyServiceForm';

export const ScheduleCompanyServiceScreen = () => {

  return (
    <View style={styles.mainContainer}>
        <ScheduleCompanyServiceForm />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  }
})


