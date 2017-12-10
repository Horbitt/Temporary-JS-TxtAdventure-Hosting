	(function () {
		var random = {};
		var time = {};
		var __name__ = '__main__';
		__nest__ (time, '', __init__ (__world__.time));
		__nest__ (random, '', __init__ (__world__.random));
		var hanFavor = 0;
		var chewFavor = 0;
		var r2Favor = 0;
		var c3Favor = 0;
		var lukeFavor = 0;
		var vaderFavor = 0;
		var landoFavor = 0;
		var fightAdvantage = 0;
		var runAdvantage = 0;
		var choiceDict = dict ({'choiceOne': 0, 'choiceTwo': 0, 'c3Returned': false, 'landoDead': false, 'hanDead': false, 'chewbaccaDead': false, 'landoJoins': false, 'vaderWounded': false, 'vaderDead': false, 'lukeDead': false, 'hitLuke': false, 'chanceShot': false, 'fightVader': false, 'leiaDead': false, 'leiaWounded': false});
		var printPauseLines = function (lines) {
			var __iterable0__ = lines;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __iterable0__ [__index0__];
				var line = __left0__ [0];
				var pause = __left0__ [1];
				print (line);
				time.sleep (pause);
			}
		};
		var askQuestionYesNo = function (question) {
			var answer = input (question + ' [y/n] ');
			return __in__ (answer, list (['y', 'Y', 'yes', 'YES', 'yes']));
		};
		var askQuestionAnswerChoices = function (question, listOfOptions) {
			for (var i = 0; i < len (listOfOptions); i++) {
				print (((str (i) + '.') + ' ') + lines);
			}
			var answer = int (input ('Select a option number'));
			return answer;
		};
		printPauseLines (list ([tuple (['', 0]), tuple (['These will be a list of controls for the game. Feel free to scroll up and reference these controls at anytime:', 0]), tuple (['Key for Yes: Press the letter y', 0]), tuple (['Key for No: Press the letter n', 0]), tuple (['Press the y or n key when prompted and then press enter to continue when asked questions.', 0]), tuple (['', 0])]));
		var pauseAns = askQuestionYesNo ('Do you want to have zero pauses between lines? This is mostly for debugging, but feel free to say yes if you want to play through the whole thing again without waiting.');
		if (pauseAns == true) {
			var zeroTime = 0;
			var oneTime = 0;
			var twoTime = 0;
			var threeTime = 0;
			var fourTime = 0;
			var fiveTime = 0;
		}
		else {
			var zeroTime = 0;
			var oneTime = 1 * 2;
			var twoTime = 2 * 2;
			var threeTime = 3 * 1.5;
			var fourTime = 4 * 1.5;
			var fiveTime = 5 * 2;
		}
		printPauseLines (list ([tuple (['', 0]), tuple (['Welcome to a very simple text based adventure game for Star Wars.', twoTime]), tuple (['Much of this will read like a short story with interactions at certain points.', twoTime]), tuple (['However, there are actually multiple endings to this story. This gives this replayability, and allows for multiple playthroughs that I encourage.', twoTime]), tuple (['To create a complex inventory system, more than X amount of branches, etc. is too much for a relatively novice programmer like me.', twoTime]), tuple (['Today, I will take you on an adventure that you may be familiar with that is set in a galaxy far, far away.', twoTime]), tuple (['This will be a really simple text-based adventure game set during Episode 5 -- The Empire Strikes Back.', twoTime]), tuple (['The scene we will be focusing on today is Cloud City. More specifically, we will be focusing on the fight against Darth Vader and changing events leading up to it.', twoTime]), tuple (["I really don't want to spoil the fun so let us get into it.", zeroTime]), tuple (['', 0])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0]), tuple (['A long time ago in a galaxy far,', zeroTime]), tuple (['far away...', fiveTime])]));
		print ('\n                  ________________.  ___     .______\n                 /                | /   \\    |   _  \n                 \\   \\    |  |    /  /_\\  \\  |      /\n            .-----)   |   |  |   /  _____  \\ |  |\\  \\-------.\n            |________/    |__|  /__/     \\__\\| _| `.________|\n             ____    __    ____  ___     .______    ________.\n             \\   \\  /  \\  /   / /   \\    |   _  \\  /        |\n              \\   \\/    \\/   / /  ^  \\   |  |_)  ||   (-----`\n               \\            / /  /_\\  \\  |      /  \\   \n                 \\__/  \\__/ /__/     \\__\\|__| `._______/\n        ');
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['REBELLION! War between the Rebels and the Galatic Empire rages on after the destruction of the Death Star. Three years after the Battle of Yavin, the Empire ', fourTime]), tuple (["discovered the Rebels' operation base on Hoth. With a hasty evacuation, we find our heroes separated on different planets and journeys. Luke Skywalker is on Dagobah ", fourTime]), tuple (['training to become the next Jedi, and the rest of the crew -- Princess Leia, Chewbacca, Han Solo, R2-D2, and C-3P0 -- find themselves in Cloud City on the planet Bespin.', fourTime]), tuple (['However, they do not know the dangers that await them...', zeroTime])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n          //||   ||\\\n         // ||   || \\\n        //  ||___||  \\\n       /     |   |     \\    _\n      /    __|   |__    \\  /_\n    /.~ __\\  |   |  /   ~.|   |\n   /  /      \\|   |/ .-~    _.-'\n  |           +---+  \\  _.-~  |\n  `=----.____/  #  \\____.----='\n   [::::::::|  (_)  |::::::::]\n  .=----~~~~~\\     /~~~~~----=.\n  |          /`---'\\          |\n   \\  \\     /       \\     /  /\n    `.     /         \\     .'\n      `.  /._________.\\  .'\n        `--._________.--'\n        ");
		printPauseLines (list ([tuple (['', 0]), tuple (['Already landing on this docking pad made me feel uneasy. Han was confident his "friend" would allow us to freely land and greet us somewhat kindly, but I already had a bad feeling about this place.', twoTime]), tuple (['Watching from a distance, I see Han and Chewy wait as their friend -- Lando Calrissian -- approach them with a stern face. He was a smuggler just like Han, but he had settled down in Cloud City', threeTime]), tuple (['and gained influence here. When I saw Lando get close and suddenly move fast toward Han, I quickly readied myself for what was going to come. However, I found myself not needing to get myself worked up.', threeTime]), tuple (["Lando simply came in for a big hug. I didn't let my guard down though, something was telling me to be cautious. As I was thinking that, I found myself being called over together with R2-D2 and C-3PO", threeTime]), tuple (['to Lando.', oneTime])]));
		printPauseLines (list ([tuple (['', 0]), tuple (['Lando: Oh what do we have here... What do I have the pleasure of having this beautiful lady arriving at my facility?', twoTime]), tuple (['', 0]), tuple (['I relay my name -- Leia -- in a friendly but assertive tone.', oneTime]), tuple (['After saying my name, I realized this first introduction was the same as all others. He is looking at me, but only what he is interested in on the outside.', twoTime]), tuple (['Typical, treating me as a beauty and not paying to any other part of me other than what make men attracted to women.', twoTime]), tuple (["Why can't I just have an introduction that doesn't involve a person commenting on my looks? I use to take it as a compliment, but now I", twoTime]), tuple (['realize that most men are looking at me simply because of my looks. As this was running through my hand, I noticed Lando grab my hand and go for a kiss on my hand as a gesture.', twoTime]), tuple (['', 0])]));
		var acceptLandoGest = askQuestionYesNo ("Do you accept Lando's hand kiss gesture? You may not like the gesture, but there could be benefits and consequences with either option.");
		if (acceptLandoGest == true) {
			printPauseLines (list ([tuple (['', 0]), tuple (["Lando slowly kisses my hand looks back into my eyes. I catch out of the corner of my eye that Han looks away in disgust, but Lando doesn't see with the obvious", twoTime]), tuple (['smile on his face looking at me. He continues to talk to the whole group.', oneTime])]));
			landoFavor++;
			hanFavor--;
		}
		else {
			printPauseLines (list ([tuple (['', 0]), tuple (["I quickly and gracefully take my hand out of Lando's hand. His face shows for a couple of seconds a transition of realization, disbelief, and then embarrasment.", twoTime]), tuple (["I notice out of the corner of my eye a quick grin by Han that Lando doesn't see, but it disappears as Lando gets back on track and talks to the whole group.", twoTime])]));
			landoFavor--;
			hanFavor++;
		}
		printPauseLines (list ([tuple (['', 0]), tuple (["As Lando was talking to the whole crew, I couldn't pay full attention after seeing the men behind Lando with such serious faces that made me uneasy. I thought I caught a glimpse of a dark figure in the door behind him", twoTime]), tuple (['with a strange aura surrounding him, but before I could make anything of it, I got interrupted in thought by Lando with his loud voice. He was talking to all 5 of us, but he was looking directly at me', oneTime]), tuple (['', 0])]));
		if (landoFavor > 0) {
			print ('Lando: Well I am excitied to continue show you all around the facility and to your quarters.');
		}
		else {
			print ('Lando: Let us go ahead and um look through the facility, and then I can show you all your quarters.');
		}
		printPauseLines (list ([tuple (['', 0]), tuple (['After saying those words, we followed him into the facility to get a quick tour as we made our ways to our temporary quarters.', oneTime]), tuple (['Despite my instinct that this place spelled trouble, I felt like I had to delve deeper and I was attracted to this place. As if something bad, but siginifcant was about to occur soon...', twoTime]), tuple (['', 0])]));
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n         /---\n        | @ @:|\n        |  " :|\n         \\_-_/\n       _.d._.b.__\n   +"i\\  |\\_/|  /i"+\n   [_| \\ |   | / |_]\n  .\' |  ):===:(  | `.\n  |:.\'+-" | | "-+`.:|\n  |_| |-. |_|   | |_|\n  \\:\\ |-\' /+\\   ! |:|\n   \\ \\|n._\\+/_.n| / /\n    \\XT::::-::::T/ /\n     "l-. `"\' .-lXX\n      |: \\   / :|\n      |:  i-i  :|\n      |:  | |  :| \n      |:  | |  :|\n     \\|;_ | |__;|/\n      (__() ()__)      \n      |:  | |  :|       \n\n    ');
		printPauseLines (list ([tuple (['', 0]), tuple (['Even though the interior looks just as nice the beautiful scenery ontop of the landing pad, the walls and machines passing by sent an unwelcoming chill through my body. I counted', twoTime]), tuple (['my steps and the doors around us as Han and Lando were talking and in the lead. However, in my own thought, I realized C-3PO and R2 were having their usual banter.', twoTime]), tuple (["I don't mind droids as much as other people. It seems Han, Chewy, and I were the only ones that seemed to truly like them. Oh I forgot someone -- Luke. He loves droids, especially R2-D2. I wonder what he is up to right now...", twoTime]), tuple (['Most other people view droids as a tool for their own use, but I think we feel much more emotion toward them. ', twoTime]), tuple (["Well I know Han isn't too fond of C-3PO. With all this thought of Luke and droids, I realize we have stopped.", twoTime]), tuple (['While Lando disappears into another room talking with other people, I see Han and Chewy walk toward the back of the group to talk to me while we wait here for him to return.', twoTime]), tuple (['', 0]), tuple (["Leia: So this was your fantastic idea, coming here? I guess we didn't have a real choice with the Empire and a bounty hunter chasing us, but this place still makes me feel uneasy.", twoTime]), tuple (["Han Solo: Relax Leia. I don't like this place either, but what what other choice do we have? Come on Chewy back me up.", twoTime]), tuple (['', 0]), tuple (["As Chewbacca replied, I realized something was wrong. I didn't hear the banter from the droids anymore. I quickly look over to where they were, but realized R2 is the only one there.", twoTime]), tuple (["I ask R2 where he went, but I couldn't get anything of it that I could understand. It seemed like Luke was the only person who could actually understand these droids...", twoTime]), tuple (['I dismiss the thought of Luke, and get to the task at hand. I hastily walk back over to Han and Chewy, and explain that C-3PO is gone.', twoTime]), tuple (['', 0]), tuple (["Han Solo: Do you think that we should go look for him? I'm sure we can just find him later. He probably is off babling his mouth off to some other droids or Lando's assistants.", twoTime]), tuple (['', 0])]));
		if (askQuestionYesNo ('Do you want to go and search for C-3PO? This may seem be a distraction, simple innocence by the droid, or something much more...') == true) {
			if (hanFavor > 0) {
				printPauseLines (list ([tuple (['Leia: I think that we should search for C-3P0!', oneTime]), tuple (["Han Solo: All right, well keep your voice down. I know that Lando won't like us snooping around. I will go with you.", oneTime]), tuple (['I have a bad feeling about this. Chewy, you go off and find Lando, and try to give us as much time as possible buddy until he realizes we are gone.', oneTime]), tuple (['R2, you are coming with us.', oneTime])]));
				r2Favor++;
				choiceDict ['choiceOne'] = 1;
			}
			else if (hanFavor < 0) {
				printPauseLines (list ([tuple (['Leia: I think we should search for C-3PO!', oneTime]), tuple (['Han Solo: Fine Princess, you go with R2 to search for 3PO. I will stay with Chewy and we will find Lando. Buy both you and R2 time to find the droid and get back here.', oneTime]), tuple (['Go ahead and get a move on.', oneTime])]));
				r2Favor++;
				hanFavor--;
				choiceDict ['choiceOne'] = 2;
			}
		}
		else {
			printPauseLines (list ([tuple (["Leia: I think it is best we don't trouble Lando for now. The place may be trouble, so we should wait it out and see any dangers. It could also be a safe place from the Empire", twoTime]), tuple (['so I think that this is another good reason not to potentially anger Lando right now.', oneTime]), tuple (["Han Solo: I agree. I don't trust Lando, he is my friend after all, but this is the best chance we have to have some safety from the Empire and that bounty hunter for however long we have.", twoTime])]));
			r2Favor--;
			hanFavor++;
			choiceDict ['choiceOne'] = 0;
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		if (choiceDict ['choiceOne'] == 1) {
			printPauseLines (list ([tuple (['', 0]), tuple (['R2, Han, and I went off to find the droid. I felt bad for leaving Chewbacca behind to distract Lando, but it should only take a few moments to find him. I could still feel', twoTime]), tuple (['a sort of weight on me while traversing through this part of Cloud City. It seemed like everything was out of the reach of the Empire, which is true after all since the Empire has not taken control', twoTime]), tuple (["of this planet and city yet. However, ever person and character I encountered did not feel truly free. I can't quite describe it, but I got the sense of an oppression weighing down on the people. After", twoTime]), tuple (['walking around searching nooks, crannies, alleys, and other areas C-3PO might have been, I felt a sudden dread when I approached a fork leading into two paths. I heard footsteps on the left with the heaviness', twoTime]), tuple (['of droids, but the right path peaked my interest with a distant sound of a ship landing and heavy footsteps.', twoTime]), tuple (['', 0]), tuple (['Han Solo: So Princess, which way do you think C-3PO went? It seems like the left path with all the droid sounds coming over there. Maybe he wanted to talk to more droids or something.', twoTime]), tuple (['', 0])]));
			if (askQuestionYesNo ('Do you want to go on the left path where the droid sounds are? It is probably where C-3PO is, but you may discover more if you take the right path. Choose wisely.') == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Leia: We should go left. I agree, it is our best bet of finding C-3PO, and I have a feeling there is too much danger on the other path.', twoTime])]));
				r2Favor++;
				hanFavor++;
				choiceDict ['choiceTwo'] = 1;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (['Leia: Something is telling me to take the right path. Before you say anything, I know, C-3PO is probably to the left, but I think we need to investiage what is going on the other path. You two stay here and I will go on ahead.', twoTime])]));
				r2Favor--;
				fightAdvantage -= 2;
				choiceDict ['choiceTwo'] = 2;
			}
		}
		else if (choiceDict ['choiceOne'] == 2) {
			printPauseLines (list ([tuple (['', 0]), tuple (['R2 and I went off to find the droid. I felt bad for leaving Han and Chewbacca behind to distract Lando, but it should only take a few moments to find him. I could still feel', twoTime]), tuple (['a sort of weight on me while traversing through this part of Cloud City. It seemed like everything was out of the reach of the Empire, which is true after all since the Empire has not taken control', twoTime]), tuple (["of this planet and city yet. However, ever person and character I encountered did not feel truly free. I can't quite describe it, but I got the sense of an oppression weighing down on the people. After", twoTime]), tuple (['walking around searching nooks, crannies, alleys, and other areas C-3PO might have been, I felt a sudden dread when I approached a fork leading into two paths. I heard footsteps on the left with the heaviness', twoTime]), tuple (['of droids, but the right path peaked my interest with a distant sound of a ship landing and heavy footsteps.', twoTime]), tuple (['', 0]), tuple (['I came to a decision point. Should I go left toward the droid sounds or right toward this mystery?', twoTime]), tuple (['', 0])]));
			if (askQuestionYesNo ('Do you want to go on the left path where the droid sounds are? It is probably where C-3PO is, but you may discover more if you take the right path. Choose wisely.') == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['I decided to go left. It seemed that is where C-3PO might be and that is my objective for now. But I cannot shake the feeling of the other path, as I point my self left...', twoTime])]));
				r2Favor++;
				choiceDict ['choiceTwo'] = 1;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (["I decided to go right, and I tell R2 to stay put. Even though my current objective is to find C-3PO, I can't shake the feeling and attraction I am feeling toward this other path...", twoTime])]));
				r2Favor--;
				choiceDict ['choiceTwo'] = 2;
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n\n                                     /~\\                           \n                                    |o o)             \n                                    _\\=/_                          \n                    ___        #   /  _  \\   #                     \n                   /() \\        \\ //|/.\\|\\//                      \n                 _|_____|_       \\/  \\_/  \\/                       \n                | | === | |         |\\ /|                          \n                |_|  O  |_|         \\_ _/                          \n                 ||  O  ||          | | |                          \n                 ||__*__||          | | |                          \n                |~ \\___/ ~|         []|[]                          \n                /=\\ /=\\ /=\\         | | |                          \n________________[_]_[_]_[_]________/_]_[_\\_________________________\n\n');
		if (choiceDict ['choiceOne'] == 1 && choiceDict ['choiceTwo'] == 1) {
			printPauseLines (list ([tuple (['We find C-3PO, but in a terrible condition. He was broken up into multiple pieces. Ravaged and scavenged for parts and some of his parts blasted apart. I still believed that we could repair him, especially', twoTime]), tuple (["with the help of Chewy and Luke if we ever reunite. I couldn't take him back alone, but since Han was there we were able to do it together. We took him to the Falcon quickly afterwards,", twoTime]), tuple (['and then met back up with Chewbacca afterwards. Curiously enough, Lando did not seem to have returned even once since Han, R2, and I have been gone. So we just waited for him like nothing ever happened.', twoTime])]));
			r2Favor += 2;
			choiceDict ['c3Returned'] = true;
		}
		else if (choiceDict ['choiceOne'] == 2 && choiceDict ['choiceTwo'] == 1) {
			printPauseLines (list ([tuple (['R2 and I find C-3PO, but in a terrible condition. He was broken up into multiple pieces. Ravaged and scavenged for parts and some of his parts blasted apart. I still believed that we could repair him, especially', twoTime]), tuple (["with the help of Chewy and Luke if we ever reunite. I couldn't take him back alone, there were too many pieces and some too heavy for myself. Regretfully, I had to leave him in a realitvely safe location until", twoTime]), tuple (['I could come back later for him. R2 and I quickly went back to Chewbacca and Han. They told me, curiously enough, Lando did not seem to have returned even once since Han, R2, and I have been gone.', twoTime]), tuple (['So we just waited for him like nothing ever happened.', oneTime])]));
			r2Favor -= 2;
			choiceDict ['c3Returned'] = false;
		}
		if (choiceDict ['choiceTwo'] != 2) {
			printPauseLines (list ([tuple (['Lando came back from his talk soon afterwards. Despite our thoughts that we would be heading to our quarters, especially since it was late in the evening, he suggested that we should eat dinner.', twoTime]), tuple (['Before we could voice any objections or ask why, we found his men standing behind us and more men appear with him. They were ready to "escort" us to our what I am sure to be our lovely meal...', twoTime])]));
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n ____\n/___/\n |     _______\n |  ,-'       `-,\n | /             \n|]|_______________|\n| ||___       ___||\n| |    `-. .-'    |\n \\`-,    | |    ,-'\n  |  \\   | |   /  |\n  |   \\  | |  /   |\n  |    | | | |    |\n  |,_  | | | |  _,|\n     `-|_|-|_|-'\n\n      ");
		if (choiceDict ['choiceTwo'] != 2 && landoFavor <= 0) {
			printPauseLines (list ([tuple (['', 0]), tuple (['We got to the door of the dinning hall. I already knew something bad was about to happen, but before I could stop or voice any sort of concern I was frozen in fear. I felt this fear before, this aura before,', twoTime]), tuple (['on the Death Star when I was imprisioned. And this fear was the aura I felt earlier when on the landing pad... I realized too late the real danger we were in when Lando opened the door.', twoTime]), tuple (['There sitting at the head of the table was Darth Vader in his menacing suit. More machine than man in a twisted way. Next to him was Boba Fett, the bounty hunter that has been chasing up.', twoTime]), tuple (["All of our eyes lit up and Han immediatley pulled out his blaster to shoot Darth Vader, but he deflected the shots and took Han's blaster. With a squad of stormtroopers appearing behind us.", twoTime])]));
			if (hanFavor > 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Darth Vader: I am glad all of you can join us.', oneTime]), tuple (['Lando: They arrived right before you did. I am sorry, there is nothing that I could do.', oneTime]), tuple (['Darth Vader: Fett, go ahead and collect your prize. Troopers, transport the Princess, the Wookiee, and the droids to our ship. They have served their purpose. Now I must go and meet a certain someone.', twoTime]), tuple (['', 0]), tuple (['I knew immediately that he meant Luke. That is what the ship landing was earlier, and I am sure he wanted revenge on him destroying his base. I had to get to him. Darth Vader disappeared and we were being escorted', twoTime]), tuple (['by Boba Fett and some stormtroopers. I signaled Han and the others that we would try to fight them. As we turned the corner, Chewbacca let out a mighty Wookiee roar, distracting everyone. Han knocked out the', twoTime]), tuple (['bounty hunter Fett, then we finished up the rest of them while Lando ran off. I discussed with them that I know Luke was here, fighting Vader, and I knew I had to go get him. While Han protested, looking at me with', twoTime]), tuple (['endearing and concerned eyes, he finally gave up and listened to me. I told them that they should go to the ship, prepare it, and get ready to pick up me and Luke.', twoTime]), tuple (["Now I was alone and I followed Vader, he didn't go too far. He was pretty slow with all the machinery. I found him entering a dark room, and I paused before I entered. I knew that these next few moments will determine the fate", twoTime]), tuple (['of the crew and the galaxy.', oneTime])]));
				choiceDict ['landoDead'] = true;
			}
			else if (hanFavor <= 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['Darth Vader: I am glad all of you can join us.', oneTime]), tuple (['Lando: They arrived right before you did. I am sorry, there is nothing that I could do.', oneTime]), tuple (['Darth Vader: Fett, go ahead and collect your prize. Troopers, transport the Princess, the Wookiee, and the droids to our ship. They have served their purpose. Now I must go and meet a certain someone.', twoTime]), tuple (['', 0]), tuple (['I knew immediately that he meant Luke. That is what the ship landing was earlier, and I am sure he wanted revenge on him destroying his base. I had to get to him. Darth Vader disappeared and we were being escorted', twoTime]), tuple (['by Boba Fett and some stormtroopers. I signaled Han and the others that we would try to fight them. As we turned the corner, Chewbacca let out a mighty Wookiee roar, distracting everyone. Han should have went for the', twoTime]), tuple (["bounty hunter Fett first, but he I saw him immedaitley go to Lando. He gets a good blaster shot to Lando's back as he ran away, but he took too distractred and Boba Fett got shot Han. A moment of shock went across everyone.", twoTime]), tuple (['Chewy immediatley went toward the bounty hunter, and despite getting shot multiple times by him, tore his limbs apart as a raging wookiee would. He quickly fell to the floor though, and it was just me and R2 left.', twoTime]), tuple (['Despite being filled with grief and anger, I told R2 to go to the ship and prep it while I go off to find Luke and stop Vader. I quickly pursued Darth Vader and found him entering a dark room. I paused before I entered.', twoTime]), tuple (['since I knew that these next few moments would be fateful.', oneTime])]));
				choiceDict ['landoDead'] = true;
				choiceDict ['hanDead'] = true;
				choiceDict ['chewbaccaDead'] = true;
			}
		}
		else if (choiceDict ['choiceTwo'] != 2 && landoFavor >= 0) {
			printPauseLines (list ([tuple (['', 0]), tuple (['A few moments before we got to the door to the dinning hall. We suddenly stop and Lando turns around to tell us what is about to happen. He explains the Empire arrived before us, and have been using us as bait to attract', twoTime]), tuple (['Luke to Cloud City so Darth Vader could capture him. Realizing the danger we were in, I told them that I had to go off and find Luke and stop Vader. While Han protested, beliving that we should fight him together', twoTime]), tuple (['he finally gave up and listened to me. I told them that they should go to the ship, prepare it, and get ready to pick up me and Luke.', twoTime]), tuple (['Now I was alone and I followed Vader. I remember hearing the area where the ship landed earlier, and I found Vader entering a dark room, and I paused before I entered. I knew that these next few moments will determine the fate', twoTime]), tuple (['of the crew and the galaxy.', oneTime])]));
		}
		if (choiceDict ['choiceTwo'] == 2) {
			printPauseLines (list ([tuple (['I followed down the right path and I encountered a dark figure entering an equally dark room. The door slamming behind him sounded just like any other door, but it echoed in my mind danger.', twoTime]), tuple (['I still pursued onwards till I reached the door. I paused before I entered since I knew that these next few moments would be fateful.', oneTime])]));
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ("\n\n                                   __          __        _.xxxxxx.\n                   [xxxxxxxxxxxxxx|##|xxxxxxxx|##|xxxxxxXXXXXXXXX|\n   ____            [XXXXXXXXXXXXXXXXXXXXX/.\\||||||XXXXXXXXXXXXXXX|\n  |::: `-------.-.__[=========---___/::::|::::::|::::||X O^XXXXXX|\n  |::::::::::::|2|%%%%%%%%%%%%\\::::::::::|::::::|::::||X /\n  |::::,-------|_|~~~~~~~~~~~~~`---=====-------------':||  5\n   ~~~~                       |===|:::::|::::::::|::====:\\O\n                              |===|:::::|:.----.:|:||::||:|\n                              |=3=|::4::`'::::::`':||__||:|\n                              |===|:::::::/  ))\\:::`----':/\n                              `===|::::::|  // //~`######b\n                                  `--------=====/  ######B\n                                                   `######b\n                                                    #######b\n                                                    #######B\n                                                    `#######b\n                                                     #######P\n                                                      `#####B\n    ");
		printPauseLines (list ([tuple (['', 0]), tuple (['I entered the dark room steeling myself for whatever was to come. I traced my eyes around the room. Fog from pipes was filling parts of this enormous room, in the center there was a circle that seemed like it could fit a person.', twoTime]), tuple (['While I was scanning the room, I hear the sound of two blades come to life. One blue light and one red light bleeding throughout the room from two sources on the other side of the room. I quickly made my way over there', twoTime]), tuple (['with blaster in hand.', twoTime]), tuple (['As I approach my eyes adjust to the darkness of the room. I can hear the blades crashing against each other, and the grunting of a young man and a machine fighting each other.', twoTime]), tuple (['I get closer and I noticed they do not sense my presence. Both are too engrossed in their battle. Adrenaline rushing through me and fear holing me, I have to decide whether I should use my blaster.', twoTime]), tuple (['', 0])]));
		if (askQuestionYesNo ('Do you choose to aim and shoot your blaster at Vader? You could hit Vader, potentially killing him or at least wounding him and allowing you and Luke to escape; however, you may miss or hit Luke. Choose wisely.') == true) {
			choiceDict ['chanceShot'] = true;
			var chanceHit = random.randint (0, 8);
			if (chanceHit == 0) {
				printPauseLines (list ([tuple (['', 0]), tuple (['You let your emotion from this whole adventure and this fear present in you get to you right now. You hit Luke, and he turns around with a shock on his face, and then falls over.', twoTime])]));
				choiceDict ['lukeDead'] = true;
				choiceDict ['hitLuke'] = true;
			}
			else if (chanceHit == 8) {
				var chanceHitTwo = random.randint (0, 8);
				if (chanceHitTwo == 8) {
					printPauseLines (list ([tuple (['', 0]), tuple (['Despite all odds, fear, you let your emotions go and concentrate. You hit Darth Vader in his most vital part by surprise. It appears to have killed him. Luke turns around and you slowly lower your blaster.', twoTime]) ('', 0)]));
					choiceDict ['lukeDead'] = false;
					choiceDict ['vaderDead'] = true;
				}
				else {
					printPauseLines (list ([tuple (['', 0]), tuple (['You are able to deal with this pressure and are able to concentrate greatly. You hit Darth Vader, and he appears to be stunned. Vader falls over and seems to be wounded. Luke turns around and you slowly lower your blaster.', twoTime]), tuple (['', 0])]));
					choiceDict ['lukeDead'] = false;
					choiceDict ['vaderWounded'] = true;
				}
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (["You let a blaster shot out, but it is without precision. It misses both of them, but this proves fatal to Luke. Darth Vader slices through Luke like bread, and the latter's lightsaber rolls toward you.", twoTime]), tuple (['', 0])]));
				choiceDict ['lukeDead'] = true;
			}
		}
		else {
			printPauseLines (list ([tuple (['', 0]), tuple (['You lower your weapon, but this proved to be fatal. There was a pause in the battle, and both Vader and Luke sense that you are there. This distracts Luke as he turns around to call to you, but Darth Vader uses', twoTime]), tuple (['this opportunity to slice through Luke like bread.', oneTime]), tuple (['', 0])]));
			choiceDict ['lukeDead'] = true;
			choiceDict ['chanceShot'] = false;
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n          _________\n          III| |III\n        IIIII| |IIIII\n       IIIIII| |IIIIII\n       IIIIII| |IIIIII\n      IIIIIII| |IIIIIII\n      IIIIIII\\ /IIIIIII\n     II (___)| |(___) II\n    II  \\    /D\\    /  II\n   II  \\ \\  /| |\\  / /  II\n  II    \\_\\/|| ||\\/_/    II\n II     / O-------O \\     II\nII_____/   \\|||||/   \\_____II\n      /               \n    ');
		if (choiceDict ['lukeDead'] == true) {
			if (choiceDict ['hitLuke'] == true) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. I realize what has happened, and I get hit in the gut with dread. What have I just done? Fear, anger, and doubt are starting to fill me. Fear most of all. I know I need', twoTime]), tuple (['to get out of here. I am going to run and get back to the others.', twoTime])]));
				choiceDict ['fightVader'] = false;
			}
			else if (choiceDict ['chanceShot'] == true) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. Despite not being able to see his eyes, Darth Vader was staring me down and I was frozen. Despite what I had happened, I knew I had to make a choice. Luke always believed', twoTime]), tuple (['in the Force. Maybe this was my time to pick up the mantle. He once told me that the great Jedi Knight Obi-Wan said that the Force flows through all. Maybe I should let it flow through me.', twoTime]), tuple (["It could be the key to my sucess in this battle, and I think Darth Vader knows feels the Force flowing through me. However, even though I discovered this now, I don't really know how to control it. I could leave and make", twoTime]), tuple (['a hasty retreat. Do I run or do I stay and fight this monster?', oneTime])]));
				if (choiceDict ['choiceTwo'] == 2) {
					print ('');
					print ('You came in here without any knowledge what may happen to you. This makes you more unprepared despite whatever choice you make.');
					fightAdvantage--;
					runAdvantage--;
				}
				print ('');
				if (askQuestionYesNo ('Do you choose to take up the lightsaber and fight Vader? Or would you rather live to fight another day after seeing his power? Enter y to fight or n to retreat.') == true) {
					printPauseLines (list ([tuple (["Despite the fear in the air weighing in, you grab the lightsaber. Even though you have never picked up a lightsaber, you feel like you've been through this before. Because you took the shot, you are feeling", twoTime]), tuple (['fully confident and you can feel the force flow through you.', oneTime])]));
					choiceDict ['fightVader'] = true;
					fightAdvantage += 2;
				}
				else {
					printPauseLines (list ([tuple (["You do not want to let Luke's death to be in vain. You choose to run, but not so you can cower rather you choose to run to fight another day. However, it will be more tough for you to escape since you took the shot", twoTime])]));
					choiceDict ['fightVader'] = false;
					runAdvantage--;
				}
			}
			else if (choiceDict ['chanceShot'] == false) {
				printPauseLines (list ([tuple (['Luke: Le--', oneTime]), tuple (['', 0]), tuple (["Luke's separated parts fall down the stairs before me. His blue lightsaber seemed to have turned off and rolled to my feet. I was staring down at his pieces and saber when I suddenly looked up due to the immense", twoTime]), tuple (['feeling coming from the top of the stairs. Despite not being able to see his eyes, Darth Vader was staring me down and I was frozen. Despite what I had happened, I knew I had to make a choice. Luke always believed', twoTime]), tuple (['in the force. Maybe this was my time to pick up the mantle, he once told me that the great Jedi Knight Obi-Wan said that the force flows through all. Maybe I should let it flow through me.', twoTime]), tuple (["It could be the key to my sucess in this battle, and I think Darth Vader knows feels the Force flowing through me. However, even though I discovered this now, I don't really know how to control it. I could leave and make", twoTime]), tuple (['a hasty retreat. Do I run or do I stay and fight this monster?', oneTime])]));
				print ('');
				if (askQuestionYesNo ('Do you choose to take up the lightsaber and fight Vader? Or would you rather live to fight another day after seeing his power?') == true) {
					printPauseLines (list ([tuple (["Despite the fear in the air weighing in, you grab the lightsaber. Even though you have never picked up a lightsaber, you feel like you've been through this before. You are confident and you can feel the Force flow through you.", twoTime]), tuple (['However, since you did not take the shot, you have some doubt in the back of your head that will affect you in your fight.', twoTime])]));
					choiceDict ['fightVader'] = true;
					fightAdvantage--;
				}
				else {
					printPauseLines (list ([tuple (["You do not want to let Luke's death to be in vain. You choose to run, but not so you can cower. You choose to run to fight another day. Since you did not take the shot, there is a better opportunity for you", twoTime]), tuple (['to make a run for it', oneTime])]));
					choiceDict ['fightVader'] = false;
					runAdvantage += 2;
				}
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the last section (epilouge)?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		print ('\n\n               .-~|\n              /   |\n       =============\n        |         |\n        |         |\n        |         |\n        \\---------/\n         )-------(\n         (-------)\n         )-------(\n         (-------)\n         )-------(\n         (-------)\n         )-------(--+\n        /---------\\ |\n        | | | | | | |\n        | | | | | | |\n        | | | | | | |\n        | | | | | |-+\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        | | | | | |\n        |_|_|_|_|_|\n\n    ');
		if (choiceDict ['lukeDead'] == false) {
			if (choiceDict ['vaderDead'] == true) {
				printPauseLines (list ([tuple (['You and Luke reunite and embrace each other. Both of you quickly still realize there is danger here, and so you quickly leave to join the others on the Falcon. With Darth Vader dead, you have scored a tremendous victory', twoTime]), tuple (['against all odds. You triumphently return to the ship with Luke, you have a positive outlook on what awaits next...', twoTime])]));
			}
			else if (choiceDict ['vaderWounded'] == true) {
				printPauseLines (list ([tuple (['You and Luke reunite and embrace each other. Both of you quickly still realize there is danger here, and so you quickly leave to join the others on the Falcon. With Darth Vader wounded, you have scored a great victory', twoTime]), tuple (['against all odds. You know that you and your friends are not completely safe, but you do not want to sour your recent victory. You triumphently return to the ship with Luke, you have a positive outlook on what awaits next...', twoTime])]));
			}
		}
		if (choiceDict ['fightVader'] == true) {
			var chanceWin = random.randint (0, 10);
			var chanceWin = chanceWin + fightAdvantage;
			if (chanceWin > 8) {
				printPauseLines (list ([tuple (['You choose to fight Vader. A valiant choice with an equal valiant effort. You feel the force flow through you, and, despite this being the first time you picked up the weapon, the lightsaber feels like an extension of your body.', twoTime]), tuple (['You battle for what felt like hours when really it lasted 5 minutes. You are able to wear him out, and are able to mortally wound him. You realize the battle is over, and you quickly retreat with your new found lightsaber and powers in the Force.', twoTime]), tuple (["You scored a major victory against the Empire, against all odds. You defeated the great Darth Vader. The Emperor's monster who has terroized the people and hunted the Jedi for ages. Now, you leave the room, but what happens", twoTime]), tuple (['next remains to be seen...', twoTime])]));
				choiceDict ['vaderDead'] = true;
			}
			else {
				printPauseLines (list ([tuple (['You choose to fight Vader. A valiant effort. You feel the force flow through you, and, despite this being the first time you picked up the weapon, the lightsaber feels like an extension of your body. You battle for what felt like hours', twoTime]), tuple (['However, you realize that you are still too much of a novice and get worn out. The veteran Darth Vader takes the upperhand and is able to cut off your hand which was holding the lightsaber. Despite being in great pain,', twoTime]), tuple (['you realize the battle is over for you. You are able to find a quick escape. Somehow you are able to find the Falcon, and you climb aboard.', twoTime]), tuple (['But you are wounded physically, emotionally, and you have taken a wound to your pride. What awaits next remains to be seen...', twoTime])]));
				choiceDict ['leiaWounded'] = true;
			}
		}
		else if (choiceDict ['fightVader'] == false && choiceDict ['lukeDead'] == true) {
			printPauseLines (list ([tuple (['', 0]), tuple (['As you are preparing to leave you notice that Luke lightsaber is still very close to you. You can choose to pick it up, but time is precious since you are trying to get away from this monster.', twoTime])]));
			if (askQuestionYesNo ("Do you choose to pick up the lightsaber? You don't encounter these every day, and this could help in the future in the war against the Empire. However, this could also cost you your life.") == true) {
				printPauseLines (list ([tuple (['', 0]), tuple (['You choose to take it. You know that this is an important relic of the past that will still greatly help the future. You believe that there are other force wielders out there, and you know this will be a great asset.', twoTime])]));
				runAdvantage--;
			}
			else {
				printPauseLines (list ([tuple (['', 0]), tuple (['You choose to leave it behind. You place a need to escape more important than some material object.', twoTime])]));
				runAdvantage++;
			}
			var chanceRun = random.randint (0, 10);
			var chanceRun = chanceRun + runAdvantage;
			if (chanceRun > 5) {
				printPauseLines (list ([tuple (['You choose to run from Vader. A wise choice as you know that his power is far too great, and there would be a great risk of failure if you attack. You are able to dodge objects that he is throwing with great power and reach', twoTime]), tuple (['the door. As he is trying to close the door with the Force, you are able to sprint and jump outside. Knowing that you can outrun him, you sprint all the way back to the ship where the rest await. As you get on the Falcon, the', twoTime]), tuple (["adrenaline dies down, and you realize what has transpired. You sit on the ship's ramp in grief and you truly do not know what awaits you in the future...", twoTime])]));
			}
			else {
				printPauseLines (list ([tuple (['You choose to run from Vader. A wise choice as you know that his power is far too great, and there would be a great risk of failure if you attack. You are able to dodge objects that he is throwing with great power and reach', twoTime]), tuple (['the door. However, as the door reaches ever so close, a piece of shrapnel from metal pierces your leg. You let out a great cry in pain, and Darth Vader approaches you. With the realization what is going to happen next,', twoTime]), tuple (['you close your eyes and wonder what will happen to your friends as the piercing sound of the lightsaber reaches ever closer to you...', twoTime])]));
				choiceDict ['leiaDead'] = true;
			}
		}
		print ('');
		if (askQuestionYesNo ('Do you want to continue to the next section (credits and list of decisions made)?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		print ('');
		printPauseLines (list ([tuple (['', zeroTime]), tuple (['-----------------------------------------------------------------', zeroTime]), tuple (['', 0])]));
		printPauseLines (list ([tuple (['', 0]), tuple (['That is the end of the game! I hope you enjoyed it and feel free to replay through it to see if you get a different outcome! I believe there are 4 different endings, and various choices in between that affect which ending you get.', 0]), tuple (['Please let me know what you think of the game! Email me at jpaz7@gatech.edu if you have any suggestion or really enjoyed it. Thank you for playing!', 0]), tuple (['Credits and Behind the Scenes Statistics:', 0]), tuple (['-Programmed in Python 3.6', 0]), tuple (['-Programmed, created, and written by Jeramie Paz', 0]), tuple (['-More than 5,000 words in the code (due to different branches/choices) according to Microsoft Word', 0]), tuple (['-Over 1000 lines of code (1008)', 0]), tuple (['-ASCII Star Wars art found online at: http://www.chris.com/ascii/index.php?art=movies/star%20wars', 0]), tuple (['', 0]), tuple (["-Author's Note: There is more I wanted to do, such as making Han going with you more significant if you go off to find C-3PO, but that would have easily added on like 200 more lines of code and it would make it too complex.", 0]), tuple (['I hope to add it in the future if I polish this up. Also, I know for sure there are many spelling and grammar mistakes so I will go ahead and apologize for that.', 0]), tuple (['', 0]), tuple (['*If you replay through this, then just note that certain choices help your chances at the end or even change it overall. Email me if you like to know about all the various endings.', 0]), tuple (["*Depending on certain choices you've made and your luck in the shot with against Darth Vader, you may have skipped literally a little over a third of the game.", 0]), tuple (['', 0]), tuple (['I will now list off all the choice/options that were avaliable to potential get your mind going if you do a replay!', 0])]));
		if (choiceDict ['choiceOne'] == 1) {
			print ('Because you did not let Lando kiss your hand, Han went with you and R2 to find C-3PO.');
		}
		if (choiceDict ['choiceOne'] == 2) {
			print ('Because you did let Lando kiss your hand, Han did not go with you and R2 to find C-3P0.');
		}
		if (choiceDict ['choiceOne'] == 0) {
			print ('You did not choose to search for C-3PO.');
		}
		if (choiceDict ['choiceTwo'] == 1) {
			print ('You chose to stick to the objective and find C-3PO by taking the left path.');
		}
		if (choiceDict ['choiceTwo'] == 2) {
			print ('You chose to let curiosty get to you and took the right path to where danger awaited.');
		}
		if (choiceDict ['landoDead'] == false) {
			print ('Lando did not die.');
		}
		else {
			print ('Lando died.');
		}
		if (choiceDict ['hanDead'] == false) {
			print ('Han Solo did not die.');
		}
		else {
			print ('Han Solo died.');
		}
		if (choiceDict ['chewbaccaDead'] == false) {
			print ('Chewbacca did not die.');
		}
		else {
			print ('Chewbacca died.');
		}
		if (choiceDict ['landoJoins'] == false) {
			print ('Lando did not help and did not join the crew.');
		}
		else {
			print ('Lando did help before reaching Darth Vader and did join the crew.');
		}
		if (choiceDict ['vaderWounded'] == true) {
			print ('Vader was wounded by Leia.');
		}
		if (choiceDict ['vaderDead'] == true) {
			print ('Darth Vader died at the hands of Leia');
			print ('Note: This was a very very very slim chance this happened. If this did, congrats!');
		}
		if (choiceDict ['chanceShot'] == true) {
			print ('You decided to take the shot against Darth Vader.');
		}
		else if (choiceDict ['hitLuke'] == true) {
			print ('You decided to run out of grief and fear for hitting Luke.');
		}
		else {
			print ('You decided to not take the shot against Darth Vader.');
		}
		if (choiceDict ['lukeDead'] == true) {
			print ('Luke died either by blaster shot or Darth Vader.');
		}
		if (choiceDict ['fightVader'] == true) {
			print ('You chose to fight Darth Vader.');
		}
		else {
			print ('You decided to run from the fight against Vader.');
		}
		if (choiceDict ['leiaWounded'] == true) {
			print ('You were wounded emotionally, mentally, and physically by Darth Vader.');
		}
		if (choiceDict ['leiaDead'] == true) {
			print ('You died at the hands of Darth Vader.');
		}
		print ('');
		if (askQuestionYesNo ('Do you want to stop this program?') == true) {
			// pass;
		}
		else {
			// pass;
		}
		__pragma__ ('<use>' +
			'random' +
			'time' +
		'</use>')
		__pragma__ ('<all>')
			__all__.__name__ = __name__;
			__all__.acceptLandoGest = acceptLandoGest;
			__all__.askQuestionAnswerChoices = askQuestionAnswerChoices;
			__all__.askQuestionYesNo = askQuestionYesNo;
			__all__.c3Favor = c3Favor;
			__all__.chanceHit = chanceHit;
			__all__.chanceHitTwo = chanceHitTwo;
			__all__.chanceRun = chanceRun;
			__all__.chanceWin = chanceWin;
			__all__.chewFavor = chewFavor;
			__all__.choiceDict = choiceDict;
			__all__.fightAdvantage = fightAdvantage;
			__all__.fiveTime = fiveTime;
			__all__.fourTime = fourTime;
			__all__.hanFavor = hanFavor;
			__all__.landoFavor = landoFavor;
			__all__.lukeFavor = lukeFavor;
			__all__.oneTime = oneTime;
			__all__.pauseAns = pauseAns;
			__all__.printPauseLines = printPauseLines;
			__all__.r2Favor = r2Favor;
			__all__.runAdvantage = runAdvantage;
			__all__.threeTime = threeTime;
			__all__.twoTime = twoTime;
			__all__.vaderFavor = vaderFavor;
			__all__.zeroTime = zeroTime;
		__pragma__ ('</all>')
	}) ();
