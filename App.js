import AddItem from "./AddItem";
import Content from "./Content";
import Footer from "./Footer";
import Heade from "./Heade";
import { useState, useEffect } from 'react';
import SearchItem from "./SearchItem";
import apiRequest from "./apiRequest";


function App() {  

  const API_URL = 'http://localhost:3500/items';
    
  const [items, setIntems] = useState([]
    );

    const [search, setSearch] = useState('')

    const [newItem, setNewItem] = useState('')

    const [fetchError,setFetchError] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => { 
      const fetchItem = async()=>{
        try {
          const response = await fetch(API_URL);
          if(!response.ok) throw Error("Data not received");
          const listItems = await response.json();
          
          setIntems(listItems)
          setFetchError(null)
        }catch(err){
          setFetchError(err.message)
        }
        finally{
          setIsLoading(false)
        }
      }

      setTimeout( () =>{
        (async () => await fetchItem())()
      },2000)
    },[])

    const addItem = async (item) => {
      const id = items.length ? items[items.length-1].id + 1 : 1;
     const addnewItem = {id, checked:false,item} 
     const listItems = [...items, addnewItem]
     setIntems(listItems)

     const postOption = {
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(addnewItem)

     }
     const result =  await apiRequest(API_URL,postOption)
     if (result) setFetchError(result)
    // localStorage.setItem("todo_list",JSON.stringify(listItems))
    }

    const handleCheck = async (id) =>{
      const listItems = items.map((item) => item.id === id ? {...item,checked:!item.checked}: item)
      setIntems(listItems)


      const myItem = listItems.filter((item) => item. 
      id === id)

      const updateOption = {
        method : 'PATCH',
        header : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({checked:myItem[0].checked})
      }

      const reqUrl = `${API_URL}/${id}`

      const result = await apiRequest(reqUrl,updateOption)
      if(result) setFetchError(result)

      

      //localStorage.setItem("todo_list",JSON.stringify(listItems))
    }

    const handleDelete = async(id) =>{
      const listItems = items.filter((item) =>
      item.id !== id)
      setIntems(listItems)
      
      const deleteOption = {method:'DELETE'}

      const reqUrl = `${API_URL}/${id}`
      const result = await apiRequest(reqUrl,deleteOption)
      if(result) setFetchError(result)

      //localStorage.setItem("todo_list",JSON.stringify(listItems))
    }
    const handleSubmit =(e) => {
      e.preventDefault();
      if(!newItem) return;
      console.log(newItem);
      addItem(newItem)
      setNewItem('')
     }
  return (
   <div className="App">
    <Heade title="Course list"/>
    <AddItem
      newItem = {newItem}
      setNewItem = {setNewItem}
      handleSubmit = {handleSubmit}
    />
    <SearchItem
      search = {search}
      setSearch = {setSearch}
    
    />
    <main>
      {isLoading && <p>Loding Items</p> }
    {fetchError && <p>{`Error: ${fetchError}`}</p>}
    {!isLoading && !fetchError && <Content
    items = {items.filter(item =>((item.item).toLowerCase()).includes(search.toLowerCase()))}
    handleCheck = {handleCheck}
    handleDelete = {handleDelete}
    />}
    </main>
    <Footer
    length = {items.length}
    />
    
   </div>
  );
}

export default App;
