import { Autocomplete, Box, Button, CircularProgress, TextField } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { supabase } from '../utility/supabaseClient';
import {GrDocumentPdf, GrDocumentWord} from 'react-icons/gr'
import email from '@sendgrid/mail'



function SendCv({user}) {
 
const [jobtitles, setJobTitles] = useState([])
const [JobTitlesEmailSubjects, setJobTitlesEmailSubjects] = useState([])
const [selectedJob, setSelectedJob] = useState([])
const [loading, setLoading] = useState(false)
const [notes, setNotes] = useState('')
const [to, setTo] = useState('')

  const defaultProps = {
    options: jobtitles,
    getOptionLabel: (option) => option.title,
    isOptionEqualToValue:(option, value) => option.title === value.title,
  };

  const defaultProps2 = {
    options: JobTitlesEmailSubjects,
    getOptionLabel: (option) => option.title,
    isOptionEqualToValue:(option, value) => option.title === value.title,
  };





  useEffect(() => {
    
    if(user){
      supabase
    .from('users')
    .select('job_position')
    .eq('user_id',user.id)
    .then((res) => setJobTitles(res.data.map(title => ({title:title.job_position}) )) )
   console.log(jobtitles);
    }
  },[])
  
  const getSelectedJobTitle = useCallback((query) =>{
    setLoading(true)
    supabase
    .from('users')
    .select('*')
    .single()
    .match({'user_id':user.id,'job_position':query })
    .then((res) => {
      setSelectedJob(res.data)
      setLoading(false)
    })
    
    console.log(selectedJob)
  } ,[selectedJob])



  function handleSelectJobTitle(query){
    getSelectedJobTitle(query)
  }
  
 async function handleSubmit(e){
  e.preventDefault()
  const session = await supabase.auth.session();
  console.log(session)
   console.log(selectedJob);
   const {jobMailInfo} = selectedJob
   
   const result = await verifyEmail(to)
   console.log('result',result)
   
  //  await sendEmail(to, notes, jobMailInfo, session)
 
}


async function verifyEmail(to){
   
  try {
    const res  = await fetch('api/verifyEmail',{
      method:'post',
      body:JSON.stringify({to}),
      headers:{
        "Content-Type": "application/json"
      }
     })

    const result = await res.json()

    return result 

  } catch (error) {
    console.log(error)
  }
}


  async function sendEmail(to, message, jobMailInfo, session){
   
    try {
     
     
      
     const res  = await fetch('api/sendEmail',{
    method:'post',
    body:JSON.stringify({to,message,jobMailInfo, session}),
    headers:{
      "Content-Type": "application/json"
    }
   })
     
   console.log(res)
   
    } catch (error) {
      console.log(error)
    }
}



  
  return (
    <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
          textAlign:'center',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center'

        }}
        noValidate
        autoComplete="off"
      >
      
      <TextField 
      onChange={(e) => setTo(e.target.value)}
      id="standard-basic" 
      label="Job Email" 
      type={'email'} 
      variant="standard" />

      <Autocomplete
        {...defaultProps}
        disableClearable
        fullWidth
        id="auto-complete"
        autoComplete
        includeInputInList
        onChange={(e) => handleSelectJobTitle(e.target.innerText)}
        renderInput={(params) => (
          <TextField {...params} label="Job Position" variant="standard" />
        )}
      />
       <Autocomplete
        {...defaultProps2}
        disableClearable
        fullWidth
        autoComplete
        value={{title:selectedJob.jobMailInfo ? selectedJob.jobMailInfo.jobEmailSubject : ''}}
        includeInputInList
        renderInput={(params) => (
          <TextField  {...params} 
          label="Email Subject" 
          variant="standard" 
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          />
        )}
       
      />
      <TextField
          id="outlined-textarea"
          label="notes..."
          placeholder="notes..."
          onChange={(e) => setNotes(e.target.value)}
          multiline
        />
         {selectedJob.jobMailInfo  ? (selectedJob.jobMailInfo.fileType === 'pdf' ?  <GrDocumentPdf className='pdfIcon' /> : <GrDocumentWord className='wordIcon'/>) : '' }
         {loading  ? <CircularProgress  color="inherit" size={20} /> :(selectedJob.jobMailInfo ? selectedJob.jobMailInfo.fileName : '')}
          <Button
           type="submit"
           variant="contained"  
           endIcon={<SendIcon/>}>
           Send
        </Button>
      
      </Box>
  )
}

export default SendCv