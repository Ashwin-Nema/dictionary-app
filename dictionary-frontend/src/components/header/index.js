import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useState, useRef } from 'react'
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {setDataForASearch, resetData} from '../../actions'
import { useDispatch } from 'react-redux';
export const Header = () => {
    const dispatch = useDispatch()
    const [showcrossicon, setShowingConditionForCrossIcon] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef()
    const [inputPlaceHolder, setinputPlaceHolder] = useState("")

    const ToggleIcon = () => {
        const nextToggleState = !showcrossicon
        if (showcrossicon) {
            setInputValue("")
            setinputPlaceHolder("")
        } else {
            setinputPlaceHolder("Search")
            inputRef.current.children[0].focus()
        }

        setShowingConditionForCrossIcon(nextToggleState)
    }

    const searchWordAndSetInput = async (e) => {
        const newValue = e.target.value
        setInputValue(e.target.value)
        const trimmedWord = newValue.trim()

        if (trimmedWord !== "") {
            dispatch( setDataForASearch(trimmedWord))
        } else if (newValue === "") {
            dispatch(resetData())
        }
    }

    return (
        <div className="d-flex justify-content-between p-3 purplebackground align-items-center ">
            <div className='text-white me-2'>Vocab</div>
            <div className='w-100'>
                <Paper
                    className='transparentbackground '
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >

                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        className="text-white"

                        ref={inputRef}
                        value={inputValue}
                        onChange={searchWordAndSetInput}
                        placeholder={inputPlaceHolder}
                    />
                    <IconButton onClick={ToggleIcon} sx={{ p: '10px' }} aria-label="search">
                        {showcrossicon ? <ClearIcon className='text-white' /> : <SearchIcon className='text-white' />}
                    </IconButton>
                </Paper>
            </div>
        </div>
    );
}