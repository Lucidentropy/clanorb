"use strict";
import './index.scss';

$(function() {
    console.log("Document Ready");

    $('.go').click(() => {
        $('.message').text('Switching to highlight reel').fadeIn();
        setTimeout(() => {
            $('.message, .header').fadeOut(1000, function() {
                $('#vid-container').css('opacity', 1);
                $('#container').fadeOut();
            });
        }, 800);
    });

    var theVideo = {
        player: document.getElementById('bg-video'),
        init() {
            this.player.addEventListener('loadeddata', () => {
                this.play();
            });
            this.player.addEventListener('ended', () => {
                this.randomVid();
            });


            $('.video-pause').click(function() {
                $(this).hide();
                theVideo.pause();
            });

            $('.video-play').click(function() {
                $(this).hide();
                theVideo.play();
            });

            this.randomVid();
        },
        play() {
            this.player.play();
            $('.video-pause').show();
        },
        pause() {
            this.player.pause();
            $('.video-play').show();
        },
        randomVid() {
            // merge children
            let videoTokens = [];
            for (var index in videoList) {
                videoTokens = videoTokens.concat(videoList[index]);
            }

            // filter out uniques
            videoTokens = [...new Set(videoTokens)];

            let token = videoTokens[Math.floor(Math.random() * videoTokens.length)];

            if (typeof token !== "undefined" && token !== "") {
                this.loadVid(token);
            } else {
                console.error(videoList, token);
            }
        },
        loadVid(itoken) {
            let webm, mp4, poster;
            let type = itoken.split(':')[0];
            let token = itoken.split(':')[1];

            switch (type) {
                case "gfycat":
                    webm = 'http://giant.gfycat.com/' + token + '.webm';
                    mp4 = 'http://giant.gfycat.com/' + token + '.mp4';
                    poster = 'http://thumbs.gfycat.com/' + token + '-poster.jpg';
                    break;
                case "imgur":
                    webm = 'http://i.imgur.com/' + token + '.webm';
                    mp4 = 'http://i.imgur.com/' + token + '.mp4';
                    poster = 'http://i.imgur.com/' + token + '.jpg';
                    break;
                default:
                    console.error('No valid type found for this token : ', token);
                    this.randomVid();
                    return false;
            }

            $('source[type="video/webm"]', this.player).attr('src', webm);
            $('source[type="video/mp4"]', this.player).attr('src', mp4);
            this.player.setAttribute('poster', poster);

            this.player.load();
        }
    }
    theVideo.init();


    // Konami Code
    let kkeys = [],
        konami = "38,38,40,40,37,39,37,39,66,65";
    $(document).keydown((e) => {
        kkeys.push(e.keyCode);
        if (kkeys.toString().indexOf(konami) >= 0) {
            kkeys = [];
            let audio = new Audio('./audio/OOT_Secret.wav');
            audio.play();

            $('body').fadeOut(2000, () => {
                window.location = 'http://www.clanorb.com/mood.html';
            });
        }
    });

    // For curious visitors
    console.groupCollapsed(
        `%c Clanorb.com website information. Click to expand in Chrome.`,
        'color:#6CF; background:#000 url(http://www.clanorb.com/images/icon_b0x0rz.gif) no-repeat 5px 50%;padding:5px 5px 5px 20px;line-height:20px;');
    console.log('The orb website is written in javascript using Node and Express. HTML written in pug. Css written in scss. Javascript dependencies, html, and scss compiled by webpack. ES2015 transpiling done by babel-core.');
    console.log('Learning front-end web development? Get started with this guide : http://jstherightway.org/');
    console.log('If you still have questions about web development for gaming websites, feel free to contact me : lucid@clanorb.com ');
    console.log('▲,▲,▼,▼,◄,►,◄,►,(B),(A)');
    console.groupEnd();
});
const videoList = {
    overwatch: [
        'gfycat:AridGroundedBactrian',
        'gfycat:BaggyVictoriousIberianmole',
        'gfycat:BeneficialFlippantBelugawhale',
        'gfycat:BossyDistortedBudgie',
        'gfycat:BossyFlippantBlackfly',
        'gfycat:BreakableFairAxolotl',
        'gfycat:CanineScholarlyIbisbill',
        'gfycat:CaringFancyIndianspinyloach',
        'gfycat:CircularExaltedFlounder',
        'gfycat:CoarseSorrowfulCub',
        'gfycat:ConstantBreakableImperialeagle',
        'gfycat:ConstantObedientAfricanjacana',
        'gfycat:CreamyShyCottonmouth',
        'gfycat:DefensiveVillainousHammerkop',
        'gfycat:DeficientSmallEgret',
        'gfycat:DelectableRadiantKiwi',
        'gfycat:DependableGlassBee',
        'gfycat:DigitalOccasionalCygnet',
        'gfycat:EagerGoodGangesdolphin',
        'gfycat:EuphoricKindheartedIbis',
        'gfycat:FavorableRewardingAnura',
        'gfycat:FrankViciousHairstreak',
        'gfycat:FrighteningEmptyArgusfish',
        'gfycat:GeneralVeneratedGermanwirehairedpointer',
        'gfycat:GiftedFrenchAzurevase',
        'gfycat:GlassHappygoluckyArthropods',
        'gfycat:GoldenFreeGonolek',
        'gfycat:IdenticalPaltryAgama',
        'gfycat:ImpartialJitteryDuiker',
        'gfycat:ImpishDimAlbacoretuna',
        'gfycat:ImpressionableLargeIbizanhound',
        'gfycat:InfantileAdmiredDromedary',
        'gfycat:InfiniteImmediateIberianlynx',
        'gfycat:InstructiveMeanGuanaco',
        'gfycat:JampackedFreshHoopoe',
        'gfycat:LastingVacantBlackfish',
        'gfycat:LightDarkDrongo',
        'gfycat:LightheartedSmallEastrussiancoursinghounds',
        'gfycat:LonelyUntriedBluefish',
        'gfycat:MellowAnyHochstettersfrog',
        'gfycat:MellowBlackHoneybee',
        'gfycat:MerryNeglectedKinglet',
        'gfycat:MisguidedGlaringGrassspider',
        'gfycat:NaiveHopefulBergerpicard',
        'gfycat:NaturalWhisperedAfricanjacana',
        'gfycat:NecessaryGoldenDevilfish',
        'gfycat:NecessaryWastefulGuineafowl',
        'gfycat:OblongBewitchedBelugawhale',
        'gfycat:OldSpryFennecfox',
        'gfycat:OrneryIcyArcticwolf',
        'gfycat:PassionateGrandioseKinglet',
        'gfycat:PlainSecretGraysquirrel',
        'gfycat:PlumpIdioticKoalabear',
        'gfycat:PresentDisgustingAplomadofalcon',
        'gfycat:QuickImpartialKob',
        'gfycat:RedThirstyHeterodontosaurus',
        'gfycat:SaltyAggressiveCockerspaniel',
        'gfycat:SatisfiedSpiffyJaguar',
        'gfycat:ScrawnyDrearyDaddylonglegs',
        'gfycat:ShabbyAltruisticCreature',
        'gfycat:SleepyBreakableFrog',
        'gfycat:SmoggyQueasyFish',
        'gfycat:TestyWhichBuzzard',
        'gfycat:ThinColorfulAmericancrayfish',
        'gfycat:UnawareSorrowfulIndianglassfish',
        'gfycat:UnderstatedFearlessCoati',
        'gfycat:UnlinedEnchantingAsiansmallclawedotter',
        'gfycat:UnrealisticSilverFlamingo',
        'gfycat:UnripeVelvetyAmethystsunbird',
        'gfycat:UnsteadyCloseHedgehog',
        'gfycat:VerifiableTeemingAnemonecrab',
        'gfycat:WatchfulFreeCock',
        'gfycat:WeepyHonorableEasternnewt',
        'gfycat:WeightyLikableBrant',
        'gfycat:WeightyRealisticDwarfmongoose',
        'gfycat:WellwornTatteredEyra',
        'gfycat:ZigzagJealousIrishredandwhitesetter',
        'imgur:nHqy2FF',
        'imgur:Gw63577',
        'imgur:XRUjTjv',
        'imgur:oegdyME',
        'imgur:KXXcGMJ',
        'imgur:tLIzoE1',
        'imgur:6chBdw5',
        'imgur:To2UDdM',
        'imgur:GwnF00r',
        'gfycat:EquatorialAdeptHammerheadshark',
        'imgur:uy4C4I1',
        'gfycat:PoliteZanyGrouper',
        'imgur:WOutVGu',
        'gfycat:BackPoshHawaiianmonkseal',
        'gfycat:HandsomeUnimportantAngelfish',
        'gfycat:FaintGregariousKoala',
        'gfycat:TerribleFineHammerheadshark',

        'gfycat:InferiorPeskyAustraliankelpie',
        'gfycat:WhirlwindLonelyDachshund',
        'gfycat:GracefulUnconsciousAustraliankelpie',
        'gfycat:FluidIdenticalAmericanquarterhorse',
        'gfycat:MajorBlackandwhiteColt',
    ],
    gta5: [
        'imgur:uNk5woD',
        'gfycat:ForsakenNervousCorydorascatfish',
        'gfycat:FarWhimsicalCivet',
        'imgur:xuxS3DN',
        'gfycat:SimilarOpulentAnemone',
        'gfycat:PepperySentimentalGraywolf',
        'gfycat:SnappyAppropriateAustraliancurlew',
        'imgur:0qnfTk9',
    ],
    rocketLeague: [
        'gfycat:ElderlyThreadbareHuemul',
        'imgur:IRhpB15',
        'gfycat:ConfusedElderlyBorzoi',
        'gfycat:ShadyImprobableIberianbarbel',
        'gfycat:GreedyLimitedBalloonfish',

    ],
    justCause: [

        'imgur:trjS6g5',
    ],
    battlefield: [
        'gfycat:AgileMeekIrukandjijellyfish',

        'imgur:kMgCYt5',
    ],
    forzaHorizon3: [
        'gfycat:ShinyVigorousCats',

    ],
    wildlands: [

        'imgur:A668H16',
    ],
    worldOfWarcraft: [

        'imgur:agZISAX',

        'imgur:JAZClBI',
    ],
    mario: [

        'imgur:RRKKAdY',
    ],
    pubg: [
        'gfycat:LameWeeBluebreastedkookaburra'
    ],
    darkSouls: [
        'imgur:lr1tQRS',
    ],
    witcher3: [
        'gfycat:LeanFlawedIberianchiffchaff',
    ],
    other: [
        'imgur:P8MhFTn',
        'imgur:ICvySRr',
        'imgur:HNfYrDk',
        'imgur:ZbPU4D4',
        'imgur:TuISmiO',
        'imgur:pWKPmx7',
        'gfycat:DearFlawedAmericancreamdraft',
        'gfycat:AffectionateLeafyGermanwirehairedpointer',
        'imgur:b3kjvHm',
    ]

}