import { getAllSearchedWordsQuery } from '../../graphqlQueries'
import { useEffect, useState } from 'react';
import { setData,resetData } from '../../actions'
import { useNavigate } from 'react-router-dom'
import {
    useQuery
} from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux'
import StyledButton from '../button'


export const WordsListComponent = () => {
    const [worddata, setWordData] = useState([])
    const wordsAPIdata = useQuery(getAllSearchedWordsQuery)
    const wordsList = useSelector(state => state.wordsList)
    const resetDataChecker = useSelector(state => state.resetData)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setData(worddata))
    }, [worddata, dispatch])

    useEffect(() => {
        if (resetDataChecker) {
            dispatch(setData(worddata))
            dispatch(resetData())
        }
    }, [resetDataChecker, dispatch, worddata])

    const navigateToWordsPage = (word) => {
        navigate(`/word/${word}`)
    }

    useEffect(() => {
        const { data } = wordsAPIdata

        if (data) {
            const { words } = data
            const wordListData = []
            for (let i = 0; i < words.length; i++) {
                const { name, categories } = words[i]
                if (Array.isArray(categories) && categories.length > 0) {
                    const { definitions, categoryname } = categories[0]
                    if (Array.isArray(definitions) && definitions.length > 0) {
                        wordListData.push({ name, categoryname, definition: definitions[0] })
                    }
                }
            }
            setWordData(wordListData)

        }
    }, [wordsAPIdata])
    return (
        <>
            <div className='p-2'>
                <strong className='smalltext'> Words List</strong>
            </div>
            {wordsList.length === 0 &&
                <strong className='px-2'>Sorry no words are currently added</strong>
            }
            {
                wordsList.map((item, index) => {
                    return <StyledButton onClick={() => navigateToWordsPage(item.name)}  key={index} className='w-100 '>
                        <div className='d-flex  w-100'>
                            <div className='flex-column'>
                            <strong className='text-dark text-capitalize d-flex'>{item.name} </strong>
                            <div >
                                <div className='text-dark d-flex'><span className='text-lowercase'>({item.categoryname})</span> 
                                <span className='texttranfformnone'>{item.definition}</span> </div>
                            </div>
                            </div>
                        </div>

                    </StyledButton>
                })
            }
        </>
    )
}