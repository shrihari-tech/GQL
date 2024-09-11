import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './schema.js';
import db from "./_db.js";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const {MONGO_URI} = process.env;
const uri = MONGO_URI;
const client = new MongoClient(uri);

const connectToDatabase = async () => {
    if(!client.isConnected){
        await client.connect();
    }
    return client.db("game_reviews");
}

    

const resolvers = {
    Query:{
        async games(){
            const db = await connectToDatabase();
            const games =  db.collection("games").find().toArray();
            console.log("Games Fetched",games);
            return games;
            
        },
        async authors(){
            const db = await connectToDatabase();
            return db.collection("authors").find().toArray();
        },
        async reviews(){
            const db = await connectToDatabase();
            return db.collection("reviews").find().toArray();
        },
        async review(_,args){
            const db = await connectToDatabase();
            // return db.reviews.find((review)=>review.id === args.id);
            return db.collection("reviews").findOne({id:args.id});
        },
        async game(_,args){
            const db = await connectToDatabase();
            // return db.games.find((game)=>game.id === args.id);
            return db.collection("games").findOne({id:args.id});
        },
        author(_,args){
            return db.authors.find((author)=>author.id === args.id);
        }
    },
    Game:{
        reviews(parent){
            return db.reviews.filter((review)=>review.game_id === parent.id);
        }
    },
    Author:{
        reviews(parent){
            return db.reviews.filter((review)=>review.author_id === parent.id);
        }
    },
    Review:{
        author(parent){
            return db.authors.filter((author)=>author.id === parent.author_id);
        },
        game(parent){
            return db.games.filter((game)=>game.id === parent.game_id);
        }
    },
    Mutation:{
        deleteGame(_,args){
            db.games = db.games.filter((game)=>game.id !== args.id);
            return db.games;
        },
        addGame(_,args){
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            }
            db.games.push(game);
            return game;
        },
        updateGame(_,args){
            db.games = db.games.map((game)=>{
                if(game.id === args.id){
                    return{
                        ...game,
                        ...args.edits
                    }
                }
                return game;
            })
            return db.games.find((game)=>game.id === args.id);
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,

});


server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });

// console.log(`Server is running on ${url}`);