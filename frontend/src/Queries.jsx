import React from 'react';
import {gql} from '@apollo/client';

export const GET_GAMES = gql`
    query GetGames{
        games{
            id,
            title,
            platform,
        }
    }
`;

export const GET_AUTHORS = gql`
    query GetAuthor{
        authors{
            id,
            name,
            verified,
        }
    }
`;

export const GET_REVIEWS = gql`
    query reviews{
        reviews{
            id,
            rating,
            content,
            author,
            author_id,
            game_id
        }
    }
` ;


export const ADD_GAME = gql`
    mutation AddGame($game:AddGameInput!){
        addGame(game:$game){
            id,
            title,
            platform
        }
    }
`;

export const ADD_AUTHOR = gql`
    mutation AddAuthor($author:AddAuthorInput!){
        addAuthor(author:$author){
            id,
            name,
            verified
        }
    }
`;

export const UPDATE_GAME = gql`
    mutation UpdateGame($id:ID!, $edits:EditGameInput!){
        updateGame(id:$id, edits:$edits){
            id,
            title,
            platform
        }
    }
`;

export const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor($id:ID!, $edits:EditAuthorInput!){
        updateAuthor(id:$id, edits:$edits){
            id,
            name,
            verified
        }
    }
`

export const DELETE_GAME = gql`
    mutation DeleteGame($id:ID!){
        deleteGame(id:$id){
            id,
            title,
            platform
        }
    }
`;

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id:ID!){
        deleteAuthor(id:$id){
            id,
            name,
            verified
        }
    }
`