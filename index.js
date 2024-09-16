import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './schema.js';
import db from "./_db.js";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const {MONGO_URI} = process.env;
const uri = MONGO_URI;
const client = new MongoClient(uri);
const checkConnection = async () => {
    console.log("loading to connect to Database");
    try{
        await client.connect();
        console.log("Connected to Database");
    }
    catch(err){
        console.log("Error Connecting to Database",err);
    }
}  

checkConnection();


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
            const games = await db.collection("games").find().toArray();
            // console.log("Games Fetched",games);
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
            const review  = await db.collection("reviews").findOne({id:args.id});
            // console.log("Fetched Review",review);
            return review;
        },
        async game(_,args){
            const db = await connectToDatabase();
            // return db.games.find((game)=>game.id === args.id);
            return db.collection("games").findOne({id:args.id});
        },
        async author(_,args){
            const db = await connectToDatabase();
            const author = await db.collection("authors").findOne({id:args.id});
            // return db.authors.find((author)=>author.id === args.id);
            // console.log("Author Fethed",author);
            return author;
        }
    },
    Game:{
        async reviews(parent){
            const db = await connectToDatabase();
            // return db.reviews.filter((review)=>review.game_id === parent.id);
            return db.collection("reviews").find({game_id:parent.id}).toArray();
        }
    },
    Author:{
        async reviews(parent){
            const db = await connectToDatabase();
            // return db.reviews.filter((review)=>review.author_id === parent.id);
            return db.collection("reviews").find({author_id:parent.id}).toArray();
        }
    },
    Review:{
        async author(parent){
            const db = await connectToDatabase();
            // return db.authors.filter((author)=>author.id === parent.author_id);
            return db.collection("authors").findOne({id:parent.author_id});
        },
        async game(parent){
            const db = await connectToDatabase();
            // return db.games.filter((game)=>game.id === parent.game_id);
            return db.collection("games").findOne({id:parent.game_id});
        }
    },
    Mutation:{
        async deleteGame(_,args){
            const db = await connectToDatabase();
            // db.games = db.games.filter((game)=>game.id !== args.id);
            // return db.games;
            await db.collection("games").deleteOne({id:args.id});
            return db.collection("games").find().toArray();
        },
        
        async deleteAuthor(_,args){
            const db = await connectToDatabase();
            await db.collection("authors").deleteOne({id:args.id});
            return db.collection("authors").find().toArray();
        },

        async addGame(_,args){
            const db = await connectToDatabase();
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            };
            // db.games.push(game);
            // return game;
            await db.collection("games").insertOne(game);
            return game;
        },

        async addAuthor(_,args){
            const db = await connectToDatabase();
            let author = {
                ...args.game,
                id:Math.floor(Math.random()*1000).toString()
            }
        },
        
        async updateGame(_,args){
            const db = await connectToDatabase();
            // db.games = db.games.map((game)=>{
            //     if(game.id === args.id){
            //         return{
            //             ...game,
            //             ...args.edits
            //         }
            //     }
            //     return game;
            // })
            // return db.games.find((game)=>game.id === args.id);
            await db.collection("games").updateOne(
                { id:args.id },
                { $set:args.edits }
            );
            return db.collection("games").findOne({id:args.id});
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