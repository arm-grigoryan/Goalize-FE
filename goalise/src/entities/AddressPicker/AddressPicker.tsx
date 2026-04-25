import React from "react"
import AddressPickerInnerCard from "../AddressPickerInnerCard"
import styles from './AddressPicker.module.css';
export const AddressPicker: React.FC = () => {
    return <div className={styles.container}>
            <AddressPickerInnerCard isSelected address="555 Market Street, San Francisco, CA, USA"/>
            <AddressPickerInnerCard  address="555 Market Street, San Francisco, CA, USA"/>
            <AddressPickerInnerCard address="555 Market Street, San Francisco, CA, USA" />
            <AddressPickerInnerCard  address="555 Market Street, San Francisco, CA, USA"/>
            <AddressPickerInnerCard address="555 Market Street, San Francisco, CA, USA"/>
            <AddressPickerInnerCard address="555 Market Street, San Francisco, CA, USA"/>
    </div>
}