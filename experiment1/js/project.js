// project.js - purpose and description here
// Author: Tyvin Tandy
// Date: 04/03/25

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();

  const fillers = {
    /* 
      adventurer: ["My dude", "Bro", "WesBot", "Adventurer", "Traveller", "Fellow", "Citizen", "Ashen One", "Dragonborn", "Cool person", "Tarnished", "勇者", "$adventurer and $adventurer", "$adventurer, $adventurer, and $adventurer", "Geoff"],
      people: ["kindly", "meek", "brave", "wise", "sacred", "cherished", "honored", "forgotten", "apathetic", "mystic", "orca", "帥氣"],
      item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
      num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
      looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
      loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
      baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
      message: ["call", "txt", "post", "decree", "shoutz", "tweets", "choiche", "hearkens", "harkening", "harkenening", "harkenenening", "...wait, no! Come back", "Watermelon"],
    */
      
      names: ["Candy","Tree","Sunny","Rain","Sevens","Crayons","Butters","Orb","Ocean","Waves","Pines","Chance","Nova","Shiny","Lenny"],
      preCityName: ["San", "New", "Los", "Santa", "Old", "Mid","Bay", "El" ,"Van"],
      midCityName: ["York", "Antonio", "Francisco","Orleans", "Angeles", "Monica", "Cruz", "Diego", "Vegas"],
      postCityName:["City","Town","Square","Park"],
      meat:["chicken","beef","shrimp"],
      system:['UC','CSU'],
      city:["Redding", "Oakland", "Fremont", "Capitola", "Daly City","Torrance","Needles","Lake Tahoe"],
      loots: ["cheese","visor","bucket","baseball","beanie","wig","clock","anime"],
    };
    
    
    
    
    const template = `$names, welcome back! Where have you been?
    
    Our city of $preCityName $midCityName $postCityName is in need of desperate help. We need you, yes you,
    
    to tell us one question. Do you know if the $meat fried this rice? 
    
    Wait, they did? Great. Let $system $city know about it, and I will give you a $loots hat. Surely you will love it!
    
    `;
    
    
    // STUDENTS: You don't need to edit code below this line.
    
    const slotPattern = /\$(\w+)/;
    
    function replacer(match, name) {
      let options = fillers[name];
      if (options) {
        return options[Math.floor(Math.random() * options.length)];
      } else {
        return `<UNKNOWN:${name}>`;
      }
    }
    
    function generate() {
      let story = template;
      while (story.match(slotPattern)) {
        story = story.replace(slotPattern, replacer);
      }
    
      /* global box */
      $("#box").text(story)
    }
    
    /* global clicker */
    $("#clicker").click(generate);
    
    generate();
}

// let's get this party started - uncomment me
main()