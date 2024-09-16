import React, { useState } from "react";
import { useQuery,useMutation } from "@apollo/client";
import { GET_GAMES,ADD_GAME,UPDATE_GAME,DELETE_GAME,GET_AUTHORS,DELETE_AUTHOR,ADD_AUTHOR} from "./Queries";

const Logic = ()=>{
    const {loading,error,data} = useQuery(GET_GAMES);
    const {loading:authorLoading,error:authorError,data:authorData} = useQuery(GET_AUTHORS);

    const [addGame] = useMutation(ADD_GAME);
    const [addAuthor] = useMutation(ADD_AUTHOR);
    const [updateGame] = useMutation(UPDATE_GAME);

    const [deleteGame] = useMutation(DELETE_GAME);
    const [deleteAuthor] = useMutation(DELETE_AUTHOR);

    const [newGame,setNewGame] = useState({title:"",platform:""});
    const [editGame,setEditGame] = useState({id:"",title:"",platform:""});

    const [newAuthor,setNewAuthor] = useState({name:"",verified:false});

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error...{error.message}</p>;

    if(authorLoading) return <p>Loading...</p>;
    if(authorError) return <p>Error...{authorError.message}</p>;

    const handleAddGame = async()=>{
        console.log("Adding New Game...");
        try{
        // await addGame({variables:{game:newGame}});
        await addGame({
            variables:{game:{...newGame,platform:newGame.platform.split(",")}}
        })
        setNewGame({title:"",platform:""});
        console.log("Game Added");
        }
        catch(err){
            console.log(err);
        }
    }

    const handleUpdateGame = async()=>{
        console.log("Editing Game....");
        await updateGame({variables:{id:editGame.id,edits:{ title: editGame.title, platform: editGame.platform }}});
        setNewGame({id:"",title:"",platform:""});
        console.log("Game Edit Done");
    }

    const handleDeleteGame = async(id)=>{
        console.log("Deleting Game....")
        await deleteGame({variables:{id:id}});
        console.log("Game Deleted");
    }

    const handleDeleteAuthor = async(id)=>{
        console.log("Deleting Author..");
        await deleteAuthor({variables:{id:id}});
        console.log("Author Deleted");
    }

    return(
        <div>
            <ul>List Games
                {data.games.map((game)=>(
                    <li key={game.id}>
                        {game.title} - {game.platform.join(",")}
                        <button onClick={()=>handleDeleteGame(game.id)}>Delete</button>
                        <button onClick={()=>setEditGame({id:game.id,title:game.title,platform:game.platform})}>Edit</button>
                    </li>
                ))}
            </ul>
            <ul>List Authors
                {authorData.authors.map((author)=>(
                    <li key={author.id}>
                        {author.name} - {author.verified ? "Verified":"Not Verified"}
                        <button onClick={()=>handleDeleteAuthor(author.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>Add Game</h2>
            <input
                type="text"
                placeholder="Title"
                value={newGame.title}
                onChange={(e)=>setNewGame({...newGame,title:e.target.value})}
            />
             <input
        type="text"
        placeholder="Platform"
        value={newGame.platform}
        onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
      />
      <button onClick={handleAddGame}>Add Game</button>

      <h2>Edit Game</h2>
      <input
        type="text"
        placeholder="Title"
        value={editGame.title}
        onChange={(e) => setEditGame({ ...editGame, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Platform"
        value={editGame.platform}
        onChange={(e) => setEditGame({ ...editGame, platform: e.target.value })}
      />
      <button onClick={handleUpdateGame}>Update Game</button>
    </div>
    )
}

export default Logic;