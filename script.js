var Player1={ime:"",komb:[],vreme:60,red:0};
var Player2={ime:"",komb:[],vreme:60,red:0};

let counter1=0;
let counter2=0;
let activePlayer=1;

function getTip(doc){
    if(doc.classList.contains("herc"))return "herc";
    else if(doc.classList.contains("karo"))return "karo";
    else if(doc.classList.contains("pik"))return "pik";
    else if(doc.classList.contains("skocko"))return "skocko";
    else if(doc.classList.contains("tref"))return "tref";
    else if(doc.classList.contains("zvezda"))return "zvezda";
    else return "prazan";
}

function getImgSrc(tip){
    if(tip=="herc")return "skocko-dodatno/herc.jpg";
    else if(tip=="karo")return "skocko-dodatno/karo.jpg";
    else if(tip=="pik")return "skocko-dodatno/pik.jpg";
    else if(tip=="skocko")return "skocko-dodatno/skocko.jpg";
    else if(tip=="tref")return "skocko-dodatno/tref.jpg";
    else if(tip=="zvezda")return "skocko-dodatno/zvezda.jpg";
    else return "skocko-dodatno/prazan.jpg";
}

function zapamptiIgrace(){
    sessionStorage.setItem("p1",JSON.stringify(Player1));
    sessionStorage.setItem("p2",JSON.stringify(Player2));
}

function ucitajIgrace(){
    Player1=JSON.parse(sessionStorage.getItem("p1"));
    Player2=JSON.parse(sessionStorage.getItem("p2"));
}

function obrisiRed(redTabele){
    for(let i=0;i<redTabele.children.length;i++){
        let cur=redTabele.children[i].children[0];
        cur.src="skocko-dodatno/prazan.jpg";
        cur.className='';
    }
    if(activePlayer==1)counter1=0;
    else counter2=0;
    redTabele.children[0].children[0].classList.add("currentlySelected");
}

function popunjenRed(redTabele){
    for(let i=0;i<redTabele.children.length;i++){
        let cur=redTabele.children[i].children[0];
        if(cur.className=='' || cur.className=='currentlySelected'){
            return false;
        }
    }
    return true;
}

function nizSaReda(redTabele){
    if(!popunjenRed(redTabele))return null;
    let niz=[
        redTabele.children[0].children[0].className,
        redTabele.children[1].children[0].className,
        redTabele.children[2].children[0].className,
        redTabele.children[3].children[0].className
    ]
    return niz;
}

function klikUnosZnaka(redTabele, tip){
    if(activePlayer==1){
        if(counter1<4){
            let cur=redTabele.children[counter1].children[0];
            cur.src=getImgSrc(tip);
            cur.classList.add(tip);
            cur.classList.remove("currentlySelected");
            counter1+=1;
            if(counter1<4) redTabele.children[counter1].children[0].classList.add("currentlySelected");
        }
    }
    else{
        if(counter2<4){
            let cur=redTabele.children[counter2].children[0];
            cur.src=getImgSrc(tip);
            cur.classList.add(tip);
            cur.classList.remove("currentlySelected");
            counter2+=1;
            if(counter2<4) redTabele.children[counter2].children[0].classList.add("currentlySelected");
        }
    }
}


/////////////////////////////////////
//  Uputstvo 
/////////////////////////////////////
function unosUputstva(){
    let ime1=document.getElementById("imePlayer1").value;
    let ime2=document.getElementById("imePlayer2").value;
    if( document.getElementById("slazePlayer1").checked  && document.getElementById("slazePlayer2").checked ){
        if(ime1==ime2){
            //imena su identicna
            document.getElementById("uputstvoInfo").innerHTML="Imena moraju da se razlikuju";
        }else{
            //sve je uredu
            //nastavi na sledecu stranicu
            document.getElementById("uputstvoInfo").innerHTML="Player1: " + ime1 + " ------ Player2: "+ime2;
            Player1.ime=ime1;
            Player2.ime=ime2;
            zapamptiIgrace();
            window.location.href = "skocko-podesavanja.html";
        }
    }else{
        //nisu stiklirali checkbox
        document.getElementById("uputstvoInfo").innerHTML="Oznacite da razumete uputstva.";
    }
}

/////////////////////////////////////
//  Podesavanje 
/////////////////////////////////////
let podTabela;

function podPokreni(){
    podTabela=document.getElementById("inTable").children[0].children[0];
    ucitajIgrace();
    podDogadjaji();
    counter1=0;
    counter2=0;
    podTabela.children[0].children[0].classList.add("currentlySelected");
    alert("Player 1: Unesite kombinaciju za igraca 2");

}

function podDogadjaji(){
    let doc=document.getElementById("unosTabela").children[0].children[0];
    for(let i=0;i<doc.children.length;i++){
        doc.children[i].children[0].addEventListener("click", function(){
            klikUnosZnaka( podTabela ,getTip(doc.children[i].children[0]));
        })
    }
}

function podObrisi(){
    return obrisiRed(podTabela);
}

function podPotvrdi(){
    if(!popunjenRed(podTabela)){
        alert("Nepopunjen red");
        return;
    }
    let niz=nizSaReda(podTabela);
    if(activePlayer==1){
        Player2.komb=niz;
        activePlayer=2;
        alert("Player 2: Unesite kombinaciju za igraca 1");
        obrisiRed(podTabela);
    }
    else{
        Player1.komb=niz;
        zapamptiIgrace();
        window.location.href="skocko-igra.html"
    }
}


//////////////////////////////////
// Igra 
//////////////////////////////////

let tabPlayer1;
let tabPlayer2;
const brojPokusaja=7;

function createTable(){
    tabPlayer1=document.getElementById("ekranPlayer1").children[0];
    tabPlayer2=document.getElementById("ekranPlayer2").children[0];
    for(let i=0; i<brojPokusaja-1;i++){
        let red=tabPlayer1.children[0];
        let cloneRed= red.cloneNode(true);
        tabPlayer1.prepend(cloneRed);
    }
    for(let i=0; i<brojPokusaja-1;i++){
        let red=tabPlayer2.children[0];
        let cloneRed= red.cloneNode(true);
        tabPlayer2.prepend(cloneRed);
    }
    // tabPlayer1=document.getElementById("ekranPlayer1").children[0];
    // tabPlayer2=document.getElementById("ekranPlayer2").children[0];
}

function igraDodajUnosDogadjaj(){
    let cur=document.getElementById("inputPlayer1").children[0].children[0];
    for(let i=0; i<cur.children.length;i++){
        cur.children[i].children[0].addEventListener("click", function(){
            klikUnosZnakaRed(getTip(cur.children[i].children[0]),1);
        });
    }
    cur=document.getElementById("inputPlayer2").children[0].children[0];
    for(let i=0; i<cur.children.length;i++){
        cur.children[i].children[0].addEventListener("click", function(){
            klikUnosZnakaRed(getTip(cur.children[i].children[0]),2);
        });
    }
}

function brisiPlayer1(){
    klikObrisi(1);
}
function brisiPlayer2(){
    klikObrisi(2);
}

function klikUnosZnakaRed(tip,brIgraca){
    if(gameIsFinished)return;
    let red;
    if(activePlayer==1 && brIgraca==1){
        red=tabPlayer1.children[Player1.red].children[0].children[0].children[0].children[0];
        klikUnosZnaka(red,tip);
    }
    else if(activePlayer==2 && brIgraca==2){
        red=tabPlayer2.children[Player2.red].children[0].children[0].children[0].children[0];
        klikUnosZnaka(red,tip);
    }
}

function klikObrisi(brIgraca){
    if(gameIsFinished)return;
    let red;
    if(activePlayer==1 && brIgraca==1){
        red=tabPlayer1.children[Player1.red].children[0].children[0].children[0].children[0];
        console.log(red.tagName);
        obrisiRed(red);
    }
    else if(activePlayer==2 && brIgraca==2){
        red=tabPlayer2.children[Player2.red].children[0].children[0].children[0].children[0];
        obrisiRed(red);
    }
}

function unosPlayer1(){
    if(!gameIsFinished)
        klikPotvrda(1);
}
function unosPlayer2(){
    if(!gameIsFinished)
        klikPotvrda(2);
}

function oznaciPogodjene(red,niz){
    for(let i=0;i<4;i++){
        if(niz[0]>0){
            //broj tacnih
            red.children[i].children[0].src="skocko-dodatno/tacan.jpg";
            niz[0]-=1;
        }
        else if(niz[1]>0){
            //broj postojecih, ne nalaze se na pravom mestu
            red.children[i].children[0].src="skocko-dodatno/postoji.jpg";
            niz[1]-=1;
        }
    }
    
}

function klikPotvrda(brIgraca){
    if(activePlayer==1 && brIgraca==1){
        let red=tabPlayer1.children[Player1.red].children[0].children[0].children[0].children[0];
        if(!popunjenRed(red))return;
        let niz=proveriKombinaciju(nizSaReda(red),Player1.komb);
        console.log(niz);
        let tacni=niz[0];
        // koristi se chldren[k] za prikazivanje pogotka, PAZI NA CHILDREN INDEX
        let pom=tabPlayer1.children[Player1.red].children[1].children[0].children[0].children[0];
        oznaciPogodjene(pom,niz);
        //pobedio player1
        if(tacni==4){
            pobedio(1);
            return;
        }

        Player1.red+=1;
        counter1=0;

        activePlayer=2;
        tabPlayer2.children[Player2.red].children[0].children[0].children[0].children[0].children[0].children[0].classList.add("currentlySelected");
    }
    else if(activePlayer==2 && brIgraca==2){
        let red=tabPlayer2.children[Player2.red].children[0].children[0].children[0].children[0];
        if(!popunjenRed(red))return;
        let niz=proveriKombinaciju(nizSaReda(red),Player2.komb);
        console.log(niz);
        let tacni=niz[0];
        // koristi se chldren[k] za prikazivanje pogotka, PAZI NA CHILDREN INDEX
        let pom=tabPlayer2.children[Player2.red].children[1].children[0].children[0].children[0];
        oznaciPogodjene(pom,niz);

        //pobedio p2
        if(tacni==4){
            pobedio(2);
            return;
        }
        if(Player1.red>=brojPokusaja){
            pobedio(0);
            return;
        }

        Player2.red+=1;
        counter2=0;

        activePlayer=1;
        tabPlayer1.children[Player1.red].children[0].children[0].children[0].children[0].children[0].children[0].classList.add("currentlySelected");

    }
}

function valueOfTip(tip){
    if(tip=="herc")return 1;
    else if(tip=="karo")return 2;
    else if(tip=="pik")return 3;
    else if(tip=="skocko")return 4;
    else if(tip=="tref")return 5;
    else if(tip=="zvezda")return 6;
    else return null;
}


function proveriKombinaciju(komb1,komb2){
    let tacni=0;
    let postoji=0;
    let tacniNiz=[0,0,0,0];
    let preostali=[0,0,0,0,0,0,0];
    for(let i=0;i<4;i++){
        if(komb1[i]==komb2[i]){
            tacniNiz[i]=1;
            tacni+=1;
        }
        else{
            preostali[valueOfTip(komb2[i])]+=1;
        }
    }
    console.log(preostali);
    for(let i=0;i<4;i++){
        if(tacniNiz[i]!=1){
            if( preostali[valueOfTip(komb1[i])]>0 ){
                postoji+=1;
                preostali[valueOfTip(komb1[i])]-=1;
            }
        }
    }
    return [tacni,postoji];

}

function otvoriResenje(){
    let cur=document.getElementById("resenjePlayer1").children[0].children[0];
    for(let i=0;i<4;i++){
        cur.children[i].children[0].src= getImgSrc(Player1.komb[i]);
    }
    let cur1=document.getElementById("resenjePlayer2").children[0].children[0];
    for(let i=0;i<4;i++){
        cur1.children[i].children[0].src= getImgSrc(Player2.komb[i]);
    }
}

function pobedio(brIgraca){
    if(brIgraca==1){
        alert("Pobedio je Player1");
    }
    else if(brIgraca==2){
        alert("Pobedio je Player2");
    }
    else{
        alert("Nereseno");
    }
    gameIsFinished=true;
    otvoriResenje();
}

let gameInProgress=false;
let gameIsFinished=false;

function pokreni(){
    if(gameIsFinished || gameInProgress){
        return;
    }
    counter1=0;
    counter2=0;
    Player1.red=0;
    Player2.red=0;
    Player1.vreme=60;
    Player2.vreme=60;
    activePlayer=1;
    tabPlayer1.children[0].children[0].children[0].children[0].children[0].children[0].children[0].classList.add("currentlySelected");
    igraDodajUnosDogadjaj();
    document.getElementById("kreniDugme").removeEventListener;
    var timer1=setInterval(function(){
        if(gameIsFinished){
            clearInterval(timer1);
        }
        else if(Player1.vreme<=0 && activePlayer==1){
            clearInterval(timer1);
            pobedio(2);
        }
        else if(Player2.vreme<=0 && activePlayer==2){
            clearInterval(timer1);
            pobedio(1);
        }
        else if(activePlayer==1){
            Player1.vreme-=1;
            document.getElementById("timerPlayer1").innerHTML=Player1.vreme;
        }
        else{
            Player2.vreme-=1;
            document.getElementById("timerPlayer2").innerHTML=Player2.vreme;
        }
    },1000)
    gameInProgress=true;
}

function podesavanja(){
    zapamptiIgrace();
    window.location.replace("skocko-podesavanja.html");
}

function igraInit(){
    ucitajIgrace();
    createTable();

}