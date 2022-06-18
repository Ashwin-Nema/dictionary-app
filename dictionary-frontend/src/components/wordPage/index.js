import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react'
import { useLazyQuery } from "@apollo/client";
import { getWordQuery } from '../../graphqlQueries'
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom'

export const WordPage = () => {
    const { word } = useParams()
    const [wordData, setWordData] = useState([])

    const navigate = useNavigate();
    const [getdatafunction, { data }] = useLazyQuery(getWordQuery, {
        variables: {
            word
        }
    })

    const RedirectoHomePage = useCallback(() => {
        navigate("/")
    }, [navigate])

    useEffect(() => {
        getdatafunction()
        if (data && !data.word) {
            RedirectoHomePage()
            return
        }

        if (data) {
            const { word: { categories } } = data
            const finaldata = categories.map((item) => {
                const definitions = item.definitions ? item.definitions : []
                const examples = item.examples ? item.examples : []
                const origin = item.origin ? item.origin : []
                const pronunciation = item.pronunciation ? item.pronunciation : null
                return { definitions, examples, origin, pronunciation, categoryname: item.categoryname }
            })
            setWordData(finaldata)
        }

    }, [data, RedirectoHomePage, getdatafunction])



    return (
        <>
            <div className='d-flex justify-content-end'>

                <CancelIcon onClick={RedirectoHomePage} />


            </div>
            <div className='mt-5 p-3'>
                <div className='fs-1 text-capitalize'>
                    {word}
                </div>

                {wordData.map((item, index) => {
                    return (
                        <div className='mt-2' key={index}>
                            <div className='fst-italic'>
                                {item.categoryname}
                            </div>

                            {
                                item.origin.length > 0 &&
                                <div className='mt-1'>
                                    Origin: {item.origin[0]}
                                </div>}

                            {
                                item.pronunciation &&
                                <div className='mt-2'>
                                    <div className='lead'>Pronunciation </div>
                                    <div>
                                    <audio
                                        controls
                                        src={item.pronunciation}>
                                        Your browser does not support the
                                        <code>audio</code> element.
                                    </audio>
                                    </div>
    
                                </div>
                            }

                            {
                                item.definitions.length > 0 &&
                                <div className='mt-1 '>
                                    <div className='lead'>Definitions </div>
                                    <ul>
                                        {item.definitions.map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })}
                                    </ul>
                                </div>
                            }

                            {
                                item.examples.length > 0 &&
                                <div className='mt-1 '>
                                    <div className='lead'>Examples </div>
                                    <ul>
                                        {item.examples.map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })}
                                    </ul>
                                </div>
                            }

                        </div>
                    )
                })}
            </div>
        </>
    )
}