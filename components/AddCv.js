import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../utility/supabaseClient';


function AddCv({user}) {
  
const [jobPosition, setJobPosition] = useState('')
const [jobEmailSubject, setJobEmailSubject] = useState('')
const [file, setFile] = useState(null)

   function formReset(){
       setFile(null)
       setJobPosition('')
       setJobEmailSubject('') 
   }


  function formValidation(jobPosition, file){
    if(jobPosition === '' || !file || jobEmailSubject === ''){
        return true
    }else{
        return false
    }

  }

async function handleAddCv(){
  const fileToBase64 = await toBase64(file)
 const {data, error} = await supabase
    .from('users')
    .insert([
      {user_id: user.id,
      job_position:jobPosition,
      jobMailInfo: {
        jobEmailSubject,
        file:fileToBase64,
        fileType:file.name.split('.').pop(),
        fileName:file.name 
      }}
    ])

    console.log(data);
 }


function handleSubmit(e){
    e.preventDefault()
   supabase.storage
  .from('documents')
  .upload(`${user.id}/${file.name}`, file)
  .then((res) => {
    if(res.data){
      handleAddCv()   
      formReset() 
    }else {
      console.log(res);
      throw new Error('something wrong with your file!')
    }

  }).catch((err) => console.log(err))
    
  }
  

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


  
    return (
     
        <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      '& > :not(style)': { m: 1},
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
value={jobPosition} 
onChange={(e) => setJobPosition(e.target.value)}  
id="standard-basic" 
label="job position" 
variant="standard" />

<TextField 
value={jobEmailSubject} 
onChange={(e) => setJobEmailSubject(e.target.value)}  
id="standard-basic" 
label="job Email Subject" 
variant="standard" />
  
  <IconButton 
  color="primary" 
  aria-label="upload picture" 
  component="label">
    <input 
    onChange={(e) => setFile(e.target.files[0])} 
    hidden 
    accept=".doc,.docx,.pdf" 
    type="file" />
    <AttachFileIcon />
  </IconButton>
  <Typography variant='p'>
        {file && file.name}
    </Typography>
  
      <Button 
      variant="contained" 
      disabled={formValidation(jobPosition, file)}
      type="submit"  
      endIcon={<AddIcon/>}>
      Add
    </Button>
  </Box>
 
  )
}

export default AddCv