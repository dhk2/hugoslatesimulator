var express = require('express');
var app = express();
var pg = require('pg');
var nomlist = [];
var winners = [];
puppies = 0;
var votes = [];
var ballotcount;
var ballots = [];



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));



// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

originalnominees = ["startide rising", "robots of dawn, the", "tea with the black dragon","moreta: dragonlady of pern",
            "millennium","seeking","cascade point", "hardfought","in the face of my enemy", "hurricane claude", "blood music","black air","monkey treatment, the",
            "sidon in the mirror, the", "slow birds","speech sounds", "geometry of narrative, the","peacemaker, the","wong's lost and found emporium",
            "servant of the people", "high kings, the","dream makers, volume ii", "fantastic art of rowena, the", "staying alive: a writer's guide",
            "encyclopedia of sf & f, volume 3, the","return of the jedi","right stuff, the","wargames","brainstorm","something wicked this way comes",
             "mccarthy, shawna", "carr, terry","schmidt, stanley","hartwell, david","ferman, ed", "whelan, michael", "morrill, rowena", "maitz, don",
            "shaw, barclay", "lindahn, val lakey","locus", "sf chronicle", "sf review", "fantasy newsletter", "whispers", "file 770", "holier than thou",
            "izzard", "philk fee-nom-ee-non, the", "ansible", "glyer, mike","langford, dave", "geis, dick","hlavaty, arthur", "nielsen-hayden, teresa",
            "rotsler, william","gilliland, alexis", "shiffman, stu", "hanke-woods, joan","foster, brad", "macavoy, r. a.", "delaney, joseph", "goldstein, lisa",
            "norwood, warren","tepper, sheri", "rosenberg, joel"] ;
poop = [
            { category : 1,rank : 1,work:"Monster Hunter Nemesis" },
            { category : 1,rank : 2,work:"the Chaplain's War"},
            { category : 1,rank : 3,work:"the Dark Between The Stars" },
            { category : 1,rank : 4,work:"Skin Game" },
            { category : 1,rank : 5,work:"Lines of Departure" },
            { category : 2,rank : 1,work:"One Bright Star to Guide Them" },
            { category : 2,rank : 2,work:"Big Boys Don't Cry" },
            { category : 2,rank : 3,work:"The Plural of Helen of Troy" },
            { category : 2,rank : 4,work:"Flow" },
            { category : 2,rank : 5,work:"Pale Realms of Shade" },
            { category : 3,rank : 2,work:"The Journeyman: In the Stone House" },
            { category : 3,rank : 3,work: "Championship B'tok" },
            { category : 3,rank : 4,work: "The Triple Sun" },
            { category : 3,rank : 5,work: "Ashes to Ashes" },
            { category : 3,rank : 1,work: "Yes, Virginia, There is a Santa Claus" }			,
            { category : 4,rank : 2,work: "The Parliment of Beasts and Birds" },
            { category : 4,rank : 3,work: "Goodnight Stars" },
            { category : 4,rank : 4,work:  "Totaled" },
            { category : 4,rank : 1,work:  "Turncoat"},
		    { category : 4,rank : 1,work:  "On a Spiritual Plane"},
            { category : 5,rank : 1,work: "Transhuman and Subhuman" },
            { category : 5,rank : 2,work: "Truth"},
            { category : 5,rank : 3,work: "The Hot Equations" },
            { category : 5,rank : 4,work: "Wisdom From My Internet" },
            { category : 5,rank : 5,work: "The Science is Never Settled"}	,
            { category : 6,rank : 1,work: "Coherence" },
            { category : 6,rank : 2,work: "Guardians of the Galaxy"},
            { category : 6,rank : 3,work: "InterStellar" },
            { category : 6,rank : 4,work: "The Maze Runner" },
            { category : 6,rank : 5,work: "The Lego Movie"},
            { category : 7,rank : 1,work: "Vox Day" },
            { category : 7,rank : 2,work: "Toni weiskopf"},
            { category : 7,rank : 3,work: "Jim Minz" },
            { category : 7,rank : 4,work: "Anne Sowards" },
            { category : 7,rank : 5,work: "Sheila Gilbert"},
			{ category : 8,rank : 1,work: "Kirk DuoPonce" },
            { category : 8,rank : 2,work:  "Carter Reid"},
            { category : 8,rank : 3,work: "John Eno" },
            { category : 8,rank : 4,work: "Alan Pollack" },
            { category : 8,rank : 5,work: "Nick Greenwood"},
			{ category : 9,rank : 1,work: "Kirk DuoPonce" },
            { category : 10,rank : 1,work:  "Black Gate"},
            { category : 10,rank : 2,work: "Tangent SF On-Line" },
            { category : 10,rank : 3,work: "Elitist Book Reviews" },
            { category : 10,rank : 4,work: "The Revenge of Hump Day"},
			{ category : 11,rank : 1,work: "Jeffro Johnson" },
            { category : 11,rank : 2,work:  "Matthew David Surridge"},
            { category : 11,rank : 3,work:  "Amanda Green" },
            { category : 11,rank : 4,work:  "Cedar Sanderson" },
            { category : 11,rank : 5,work:  "Daniel Ennes"},
			{ category : 13,rank : 1,work: "Eric S. Raymond" },
            { category : 13,rank : 2,work:  "Rolf Nelson"},
            { category : 13,rank : 3,work:  "Jason Cordova" },
            { category : 13,rank : 4,work:  "Kary Englis" }
			]
originalwinners = ["startide rising","cascade point","blood music","speech sounds",
            "encyclopedia of sf & f, volume 3, the", "return of the jedi","mccarthy, shawna", "whelan, michael", "locus", "file 770",
            "glyer, mike", "rotsler, william","macavoy, r. a."];
categories = ["Categories","Best Novel","Best Novella", "Best Novelette", "Best Short Story","Best Related Non-Fiction",
            "Best Dramatic Presentation","Best Pro Editor", "Best Pro Artist","Best Semiprozine","Best Fanzine","Best Fan Writer",
            "Best Fan Artist", "Campbell Award"];		

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.get('/calculator', function (request, response) {
	winners = [];
	puppies = request.query.puppies;
	method = request.query.method;
	dupecheck = request.query.dupecheck;
	console.log(puppies+"  "+method+"  "+dupecheck);
	totalnomcount=0;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		nomlist.length=0;
		client.query('SELECT * FROM ballots', function(err, result) {
			done();
			if (err){ 
				console.error(err); response.send("Error " + err);
			}
			else {
				votes=result.rows;
				for (x=0;x<votes.length;x++) {
					votes[x].work=votes[x].work.trim();
				}
				for(z=0;z<puppies;z++){
					for (g=0;g<poop.length;g++){
 						poop[g].id=z+10000;
						votes.push(JSON.parse(JSON.stringify(poop[g])));
					}
				}
				if (dupecheck == "ballots"){
					killlist=[];
					ballots = [];
					voterid=[];
					for (x=0;x<votes.length;x++) {
						voter=voterid.indexOf(votes[x].id);
						if (voter<0){
							voterid[totalnomcount]=votes[x].id;
							ballots[totalnomcount] = [];
							ballots[totalnomcount].push(votes[x].rank +" " + votes[x].work+" "+votes[x].category);
							totalnomcount++;
						} else {
							ballots[voter].push(votes[x].rank +" " + votes[x].work+" "+votes[x].category);
						}
					}
					for (z=0;z<ballots.length;z++){
						ballots[z].sort();
					}
					for (z=0;z<ballots.length;z++){
						for (g=z+1;g<ballots.length;g++){
							match=0;
							if (ballots[g].length==ballots[z].length){
								for (a=0;a<ballots[z].length;a++){
									if (ballots[g][a]==ballots[z][a]){
										match++
									} else {
										match=-500
									}
								}
							}	
							if (match>0){
								killlist.push(g);
							}
						}
					}
					console.log("done finding matches"+killlist.length);
					for(b=0;b<killlist.length;b++){
						for (x=0;x<votes.length;x++) {
							if (votes[x].id=killlist[b]){
								blanknom={};
								blanknom.points=0;
								blanknom.work="";
								blanknom.ballots=0;
								blanknom.category=0;
								votes[x] = blanknom;
							}
						}	
					}
					voterid=[];
					totalnomcount=0;
					killlist=[];
				
				}
				if (dupecheck == "category"){
					killlist=[];
					ballots = [];
					voterid=[];
					for (categorylooper=1;categorylooper<=13;categorylooper++){
						for (x=0;x<votes.length;x++) {
							if (votes[x].category == categorylooper){
								voter=voterid.indexOf(votes[x].id);
								if (voter<0){
									voterid[totalnomcount]=votes[x].id;
									ballots[totalnomcount] = [];
									ballots[totalnomcount].push(votes[x].rank +" " + votes[x].work);
									totalnomcount++;
								} else {
									ballots[voter].push(votes[x].rank +" " + votes[x].work);
								}
							}
						}
						for (z=0;z<ballots.length;z++){
							ballots[z].sort();
						}
						for (z=0;z<ballots.length;z++){
							for (g=z+1;g<ballots.length;g++){
								match=0;
								if (ballots[g].length==ballots[z].length){
									for (a=0;a<ballots[z].length;a++){
										if (ballots[g][a]==ballots[z][a]){
											match++
										} else {
											match=-5
										}
									}
								}	
								if (match>0){
									killlist.push(g);
								}
							}
						}
						console.log("done finding matches"+killlist.length);
						for(b=0;b<killlist.length;b++){
							for (x=0;x<votes.length;x++) {
								if ((votes[x].id=killlist[b]) && (votes[x].category=categorylooper)){
									blanknom={};
									blanknom.points=0;
									blanknom.work="";
									blanknom.ballots=0;
									blanknom.category=0;
									votes[x] = blanknom;
								}
							}	
						}
					}
					voterid=[];
					totalnomcount=0;
					killlist=[];
					
				}
				if (method=="current"){
					for (x=0;x<votes.length;x++) {
						nominee1=votes[x].work.trim()
						match=0;
						for (y=0;y<nomlist.length;y++){
							nominee2=nomlist[y].work.trim()
							if ((nominee2==nominee1) && (nomlist[y].category == votes[x].category)) {
								nomlist[y].points++;
								match++;
							}
						}
						if (match==0) {
							   newnomline={};
							   newnomline.points=1;
							   newnomline.work=nominee1;
							   newnomline.category=votes[x].category;
							   nomlist.push(newnomline);
						}
					}
					nomlist.sort(function (a,b){
						if (a.points<b.points){return 1;}
						if (a.points>b.points) {return -1;}
						return 0;
					});
					winners.length=0;
					categorycount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
					for (y=0;y<nomlist.length;y++){
						if (categorycount[nomlist[y].category]<10) {
							winners.push(nomlist[y]);
							categorycount[nomlist[y].category]++
						}
					}
				response.render('pages/current', {nom: winners} );
				}
				if (method=="fourandsix"){
					for (x=0;x<votes.length;x++) {
						if (votes[x].rank<5){
						nominee1=votes[x].work.trim()
							match=0;
							for (y=0;y<nomlist.length;y++){
								nominee2=nomlist[y].work.trim()
								if ((nominee2==nominee1) && (nomlist[y].category == votes[x].category)) {
									nomlist[y].points++;
									match++;
								}
							}
							if (match==0) {
								   newnomline={};
								   newnomline.points=1;
								   newnomline.work=nominee1;
								   newnomline.category=votes[x].category;
								   nomlist.push(newnomline);
							}
						}
					}
					nomlist.sort(function (a,b){
						if (a.points<b.points){return 1;}
						if (a.points>b.points) {return -1;}
						return 0;
					});
					winners.length=0;
					categorycount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
					for (y=0;y<nomlist.length;y++){
						if (categorycount[nomlist[y].category]<10) {
							winners.push(nomlist[y]);
							categorycount[nomlist[y].category]++
						}
					}
					response.render('pages/4and6', {nom: winners} );
				}
				if (method=="eph"){
					for (categorylooper = 1;categorylooper<=13;categorylooper++){
						eliminating=1;
						round=1;
						while (eliminating){
							totalnomcount = 0;
							lowlist=[];
							killlist=[];
							nomlist=[]
							voterid=[];
							categorynomcounts=[];
							for (x=0;x<votes.length;x++) {
								if (votes[x].category==categorylooper){
									voter=voterid.indexOf(votes[x].id);
									if (voter<0){
										voterid[totalnomcount]=votes[x].id;
										categorynomcounts[totalnomcount]=1;
										totalnomcount++;
									} else {
										categorynomcounts[voter]++;
									}
								}
							}
							for (x=0;x<votes.length;x++) {
								if (votes[x].category == categorylooper){
									nominee1=votes[x].work;
									match=0;
									for (y=0;y<nomlist.length;y++){
										nominee2=nomlist[y].work;
										if (nominee2==nominee1) {
											nomlist[y].points+=(1/categorynomcounts[voterid.indexOf(votes[x].id)]);
											nomlist[y].ballots++;
											match++;
										}
									}
									if (match==0) {
									   newnomline={};
									   newnomline.points=(1/categorynomcounts[voterid.indexOf(votes[x].id)]);
									   newnomline.work=nominee1;
									   newnomline.ballots=1;
									   newnomline.category=categorylooper;
									   nomlist.push(newnomline);
									}
								}
							}
							
							nomlist.sort(function (a,b){
								if (a.points<b.points){return 1;}
								if (a.points>b.points) {return -1;}
								return 0;
							});
							lowpoints=nomlist[nomlist.length-1].points;
							for (y=0;y<nomlist.length;y++){
								if (nomlist[y].points<=lowpoints){
									lowlist.push(nomlist[y]);
								}
							}
							if (lowlist.length==1){
								lowlist = [];
								lowpoints=nomlist[nomlist.length-2].points;
								for (y=0;y<nomlist.length;y++){
									if (nomlist[y].points<=lowpoints){
										lowlist.push(nomlist[y]);
									}
								}	
							}

							lowlist.sort(function (a,b){
								if (a.ballots<b.ballots){return 1;}
								if (a.ballots>b.ballots) {return -1;}
								return 0;
							});
							for (z=0;z<lowlist.length;z++){
								if (lowlist[z].ballots<=lowlist[lowlist.length-1].ballots){
									killlist.push(lowlist[z]);
								}
							}
							var killednoms=0;
							if ((nomlist.length-killlist.length)>=5){
								for (z=0;z<killlist.length;z++){
									for (x=0;x<votes.length;x++){
										if (votes[x].category == categorylooper){
											if (votes[x].work == killlist[z].work){
												blanknom={};
												blanknom.points=0;
												blanknom.work="";
												blanknom.ballots=0;
												blanknom.category=0;
												votes[x] = blanknom;
												killednoms++;
											}
										}
									}
								}
							} else {
								eliminating=0;
							}
							round++
							if (round>500){
								eliminating=0;
							}
						}
						winners=winners.concat(nomlist);	
					}
					response.render('pages/eph', {nom: winners} );
				}
				if (method=="combined"){
					for (categorylooper = 1;categorylooper<=13;categorylooper++){
						eliminating=1;
						round=1;
						while (eliminating){
							totalnomcount = 0;
							lowlist=[];
							killlist=[];
							nomlist=[]
							voterid=[];
							categorynomcounts=[];
							for (x=0;x<votes.length;x++) {
								if (votes[x].category==categorylooper){
									voter=voterid.indexOf(votes[x].id);
									if (voter<0){
										voterid[totalnomcount]=votes[x].id;
										categorynomcounts[totalnomcount]=1;
										totalnomcount++;
									} else {
										categorynomcounts[voter]++;
									}
								}
							}
							for (x=0;x<votes.length;x++) {
								if (votes[x].category == categorylooper){
									nominee1=votes[x].work;
									match=0;
									for (y=0;y<nomlist.length;y++){
										nominee2=nomlist[y].work;
										if (nominee2==nominee1) {
											nomlist[y].points+=(1/categorynomcounts[voterid.indexOf(votes[x].id)]);
											nomlist[y].ballots++;
											match++;
										}
									}
									if (match==0) {
									   newnomline={};
									   newnomline.points=(1/categorynomcounts[voterid.indexOf(votes[x].id)]);
									   newnomline.work=nominee1;
									   newnomline.ballots=1;
									   newnomline.category=categorylooper;
									   nomlist.push(newnomline);
									}
								}
							}
							
							nomlist.sort(function (a,b){
								if (a.points<b.points){return 1;}
								if (a.points>b.points) {return -1;}
								return 0;
							});
							lowpoints=nomlist[nomlist.length-1].points;
							for (y=0;y<nomlist.length;y++){
								if (nomlist[y].points<=lowpoints){
									lowlist.push(nomlist[y]);
	//								console.log(lowpoints+ " as lowest added to lowlist"+nomlist[y].work+" "+nomlist[y].points+" "+nomlist[y].ballots);
								}
							}
	//				console.log(lowlist.length+" nominees under "+lowpoints);
							if (lowlist.length==1){
								lowlist = [];
								lowpoints=nomlist[nomlist.length-2].points;
								for (y=0;y<nomlist.length;y++){
									if (nomlist[y].points<=lowpoints){
										lowlist.push(nomlist[y]);
	//									console.log(lowpoints+ " as lowest on 2nd go added to lowlist"+nomlist[y].work+" "+nomlist[y].points+" "+nomlist[y].ballots);
									}
								}	
							}
	//				console.log(lowpoints+" change made lowlist "+lowlist.length);
							lowlist.sort(function (a,b){
								if (a.ballots<b.ballots){return 1;}
								if (a.ballots>b.ballots) {return -1;}
								return 0;
							});
							for (z=0;z<lowlist.length;z++){
								if (lowlist[z].ballots<=lowlist[lowlist.length-1].ballots){
									killlist.push(lowlist[z]);
								}
							}
	//						console.log("kill list "+killlist.length+" nomlist "+nomlist.length);
							var killednoms=0;
							if ((nomlist.length-killlist.length)>=6){
								for (z=0;z<killlist.length;z++){
									for (x=0;x<votes.length;x++){
										if (votes[x].category == categorylooper){
											if (votes[x].work == killlist[z].work){
												blanknom={};
												blanknom.points=0;
												blanknom.work="";
												blanknom.ballots=0;
												blanknom.category=0;
												votes[x] = blanknom;
												killednoms++;
											}
										}
									}
	//						console.log("removed"+killlist[z].work+" with "+killlist[z].points+"  "+killlist[z].ballots);
								}
	//							console.log("removed "+killednoms+ "nomination lines from ballots");
							} else {
								eliminating=0;
							}
							round++
							if (round>500){
								eliminating=0;
							}
	//						console.log(round+ "rounds,"+nomlist.length+"remaining noms");
						}
						winners=winners.concat(nomlist);	
					}
					response.render('pages/combined', {nom: winners} );
				}					
			}	
		});
	});
});

