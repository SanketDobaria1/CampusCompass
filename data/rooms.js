import {locations} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../validate.js';

const exportedMethods = {
    async getById(roomId) {
        roomId = validation.checkId(roomId, 'RoomID');
        
        const locationsCollection = await locations();
        const locationsList = await locationsCollection
        .findOne(
            {'rooms._id': new ObjectId(roomId)},
            {projection: {_id: 0, 'rooms.$': 1}}
          );
        if (locationsList === null) throw 'No Room found with that Id';
        locationsList.rooms[0]._id = locationsList.rooms[0]._id.toString();
        return locationsList.rooms[0];          
    },


    async create(locationId, room_number, capacity, floor_number, type){

        // ERROR HANDLING & INPUT VALIDATIONS //

        const date = new Date()
        date.setTime(date.getTime() + (-240)*(60)*(1000))

        let newRoom = {
            _id: new ObjectId(),
            room_number: room_number,
            capacity: capacity,
            floor_number: floor_number,
            type: type,
        };

        const locationsCollection = await locations();
        const locationInfo = await locationsCollection.findOneAndUpdate({_id: new ObjectId(locationId)}, {$push: {rooms: newRoom}, $set: {lastupdatedDate: date.toISOString()}}, {returnDocument: 'after'});

        let newId = ""
        locationInfo.value.rooms.forEach(element => {
            if(element._id.toString() === newRoom._id.toString()){
                newId = element._id.toString()
            }
        });
        const room = await this.getById(newId);
        return room;
    },

    async getAll(locationId){
        locationId = validation.checkId(locationId, 'locationId');

        const locationsCollection = await locations();
        let location = await locationsCollection.findOne({_id: new ObjectId(locationId)});
        if(location === null) throw 'No location found with that Id';
        let roomsList = await location.rooms
        if (!roomsList) throw 'Could not get all rooms';
        
        roomsList = roomsList.map((element) => {
          element._id = element._id.toString();
          return element;
        });
        return roomsList;
    },

    async remove(roomId){
        roomId = validation.checkId(roomId, 'roomId');

        const locationsCollection = await locations();
        const locationsInfo = await locationsCollection.findOneAndUpdate({'rooms._id': new ObjectId(roomId)}, {$pull: {rooms: {_id: new ObjectId(roomId)}}}, {returnDocument: 'after'});
        if (locationsInfo.lastErrorObject.n === 0) throw 'Could not remove room successfully OR No room found with this ID!';

        return `Room with provided RoomId has been successfully deleted!`;
    }
};

export default exportedMethods;