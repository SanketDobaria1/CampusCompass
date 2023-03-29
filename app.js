import {dbConnection, closeConnection} from './config/mongoConnection.js';
import {locationsData} from "./data/index.js";

const db = await dbConnection();
//await db.dropDatabase();

async function main() {
    let howeCenter = undefined;
    let library = undefined;
    let athleticCenter = undefined
    // try{
    //     howeCenter = await locationsData.create("Howe Center", "The Howe Center is situated at the top of the hill on Castle Point where the ancestral home of the Stevens family – Castle Stevens – once stood. Built in 1784 by Colonel John Stevens the Georgian-style mansion served, at times, as a dormitory, a cafeteria and office space.", "administrative", ["08:00:00","23:00:00"]);
    //     console.log(howeCenter)
    // }catch(e){console.log(e)}

    // try{
    //     library = await locationsData.create("Samuel C Williams Library", "The Samuel C. Williams Library is the center for information discovery and preservation at Stevens Institute of Technology. The Library is dedicated to fostering an innovative environment with technology, education, and culture. It is our goal to create a distinctive library experience through services and resources that promote information and media literacy, knowledge creation, global scholarly communication, and critical and creative thinking for our students, faculty, and researchers around the world.", "Library", ["08:00:00","23:59:59"]);
    // }catch(e){console.log(e)}

    // try{
    //     athleticCenter = await locationsData.create("Schaefer Athletic and Recreation Center", "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.", "Recreational", ["09:00:00","20:00:00"]);
    // }catch(e){console.log(e)}

    // try{
    //     console.log(await locationsData.getById('ID'))
    // }catch(e){console.log(e)}

    // try{
    //     console.log(await locationsData.remove('ID'))
    // }catch(e){console.log(e)}

    // try{
    //     athleticCenter = await locationsData.update("64249cfd1d18cad4ef882dc5", "Stevens Schaefer Athletic & Recreation Center", "All students must wear a mask at all times and practice social distancing. Students are encouraged to minimize the number of personal belongings brought into the facilities.", "Recreational", ["09:00:00","20:00:00"]);
    // }catch(e){console.log(e)}
}
await main();
await closeConnection();