import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAMES, ADD_GAME, UPDATE_GAME, DELETE_GAME, GET_AUTHORS, DELETE_AUTHOR, ADD_AUTHOR, UPDATE_AUTHOR } from "./Queries";

const Logic = () => {
    const { loading, error, data } = useQuery(GET_GAMES);
    const { loading: authorLoading, error: authorError, data: authorData } = useQuery(GET_AUTHORS);

    const [addGame] = useMutation(ADD_GAME);
    const [addAuthor] = useMutation(ADD_AUTHOR);

    const [updateGame] = useMutation(UPDATE_GAME);
    const [updateAuthor] = useMutation(UPDATE_AUTHOR);

    const [deleteGame] = useMutation(DELETE_GAME);
    const [deleteAuthor] = useMutation(DELETE_AUTHOR);

    const [newGame, setNewGame] = useState({ title: "", platform: "" });
    const [editGame, setEditGame] = useState({ id: "", title: "", platform: "" });

    const [newAuthor, setNewAuthor] = useState({ name: "", verified: false });
    const [editAuthor, setEditAuthor] = useState({ id: "", name: "", verified: false });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error...{error.message}</p>;

    if (authorLoading) return <p>Loading...</p>;
    if (authorError) return <p>Error...{authorError.message}</p>;

    const handleAddGame = async () => {
        console.log("Adding New Game...");
        try {
            await addGame({
                variables: { game: { ...newGame, platform: newGame.platform.split(",") } }
            });
            setNewGame({ title: "", platform: "" });
            console.log("Game Added");
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddAuthor = async () => {
        try {
            await addAuthor({ variables: { author: newAuthor } });
            setNewAuthor({ name: "", verified: false });
            console.log("Author Added");
        } catch (err) {
            console.log(err);
        }
    };

    const handleUpdateGame = async () => {
        console.log("Editing Game....");
        await updateGame({ variables: { id: editGame.id, edits: { title: editGame.title, platform: editGame.platform } } });
        setEditGame({ id: "", title: "", platform: "" });
        console.log("Game Edit Done");
    };

    const handleUpdateAuthor = async () => {
        console.log("Editing Author....");
        await updateAuthor({ variables: { id: editAuthor.id, edits: { name: editAuthor.name, verified: editAuthor.verified } } });
        setEditAuthor({ id: "", name: "", verified: false });
        console.log("Author Edit Done");
    };

    const handleDeleteGame = async (id) => {
        console.log("Deleting Game....");
        await deleteGame({ variables: { id } });
        console.log("Game Deleted");
    };

    const handleDeleteAuthor = async (id) => {
        console.log("Deleting Author...");
        await deleteAuthor({ variables: { id } });
        console.log("Author Deleted");
    };

    return (
        <div>
            <ul>List Games
                {data.games.map((game) => (
                    <li key={game.id}>
                        {game.title} - {game.platform.join(",")}
                        <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
                        <button onClick={() => setEditGame({ id: game.id, title: game.title, platform: game.platform.join(",") })}>Edit</button>
                    </li>
                ))}
            </ul>
            <ul>List Authors
                {authorData.authors.map((author) => (
                    <li key={author.id}>
                        {author.name} - {author.verified ? "Verified" : "Not Verified"}
                        <button onClick={() => setEditAuthor({ id: author.id, name: author.name, verified: author.verified })}>Edit</button>
                        <button onClick={() => handleDeleteAuthor(author.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <h2>Add Game</h2>
            <input
                type="text"
                placeholder="Title"
                value={newGame.title}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
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

            <h2>Add Author</h2>
            <input
                type="text"
                placeholder="Name"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
            />
            <input
                type="checkbox"
                checked={newAuthor.verified}
                onChange={(e) => setNewAuthor({ ...newAuthor, verified: e.target.checked })}
            />
            <button onClick={handleAddAuthor}>Add Author</button>

            <h2>Edit Author</h2>
            <input
                type="text"
                placeholder="Name"
                value={editAuthor.name}
                onChange={(e) => setEditAuthor({ ...editAuthor, name: e.target.value })}
            />
            <input
                type="checkbox"
                checked={editAuthor.verified}
                onChange={(e) => setEditAuthor({ ...editAuthor, verified: e.target.checked })}
            />
            <button onClick={handleUpdateAuthor}>Update Author</button>
        </div>
    );
};

export default Logic;
