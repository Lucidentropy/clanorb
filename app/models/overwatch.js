let cheerio = require('cheerio');
let overwatch = {
    parseData(response){ 
        // profile html parsing copied from https://github.com/alfg/overwatch-api
        const $ = cheerio.load(response.text);
        const user = $('.header-masthead').text();
        const level = $('.player-level div').first().text();
        const portrait = $('.player-portrait').attr('src');

        const prestigeEl = $('.player-level').first().attr('style');
        const prestigeHex = prestigeEl.match(/0x0*[1-9a-fA-F][0-9a-fA-F]*/);
        const prestigeLevel = prestigeHex ? this.getPrestigeLevel(prestigeHex[0]) : 0;

        const stats = {}

        const quickplayTopHeroesEls = $('#quickplay [data-category-id="overwatch.guid.0x0860000000000021"]').find('.progress-category-item');
        let quickplayTopHeroes = [];
        quickplayTopHeroesEls.each(function (i, el) {
            const stat = {};
            stat.hero = $(this).find('.title').text();
            stat.played = $(this).find('.description').text();
            stat.img = $(this).find('img').attr('src');
            quickplayTopHeroes.push(stat);
        });
        stats['top_heroes'] = {
            quickplay: []
        };
        stats['top_heroes']['quickplay'] = quickplayTopHeroes;

        const compTopHeroesEls = $('#competitive [data-category-id="overwatch.guid.0x0860000000000021"]').find('.progress-category-item');
        let compTopHeroes = [];
        compTopHeroesEls.each(function (i, el) {
            const stat = {};
            stat.hero = $(this).find('.title').text();
            stat.played = $(this).find('.description').text();
            stat.img = $(this).find('img').attr('src');
            compTopHeroes.push(stat);
        });
        stats['top_heroes']['competitive'] = [];
        stats['top_heroes']['competitive'] = compTopHeroes;

        const statCategories = [
            'Combat',
            'Match Awards',
            'Assists',
            'Average',
            'Miscellaneous',
            'Best',
            'Game'
        ];

        statCategories.forEach(function (item) {
            const els = $(`#quickplay [data-category-id="0x02E00000FFFFFFFF"] h5:contains("${item}")`).closest('table').find('tbody tr');
            let statsArr = [];
            els.each(function (i, el) {
                let stat = {};
                stat.title = $(this).find('td').first().text();
                stat.value = $(this).find('td').next().text();
                statsArr.push(stat);
            });
            item = item.replace(' ', '_').toLowerCase();
            stats[item] = {
                quickplay: []
            };
            stats[item]['quickplay'] = statsArr;
        });

        statCategories.forEach(function (item) {
            const els = $(`#competitive [data-category-id="0x02E00000FFFFFFFF"] h5:contains("${item}")`).closest('table').find('tbody tr');
            let statsArr = [];
            els.each(function (i, el) {
                let stat = {};
                stat.title = $(this).find('td').first().text();
                stat.value = $(this).find('td').next().text();
                statsArr.push(stat);
            });
            item = item.replace(' ', '_').toLowerCase();
            stats[item]['competitive'] = [];
            stats[item]['competitive'] = statsArr;
        });

        return {
            username: user,
            level: parseInt(level) + prestigeLevel,
            prestigeLevel,
            portrait: portrait,
            stats: stats
        };
    },
    getPrestigeLevel(val) {
        for (var k in prestigeLevels) {
            if (k === val) {
                return prestigeLevels[k] * 100;
            }
        }
        return 0;
    }
}
const prestigeLevels = {
    "0x0250000000000918": 0, // Bronze 0-5
    "0x0250000000000919": 0,
    "0x025000000000091A": 0,
    "0x025000000000091B": 0,
    "0x025000000000091C": 0,
    "0x025000000000091D": 0,
    "0x025000000000091E": 0,
    "0x025000000000091F": 0,
    "0x0250000000000920": 0,
    "0x0250000000000921": 0,
    "0x0250000000000922": 1,
    "0x0250000000000924": 1,
    "0x0250000000000925": 1,
    "0x0250000000000926": 1,
    "0x025000000000094C": 1,
    "0x0250000000000927": 1,
    "0x0250000000000928": 1,
    "0x0250000000000929": 1,
    "0x025000000000092B": 1,
    "0x0250000000000950": 1,
    "0x025000000000092A": 2,
    "0x025000000000092C": 2,
    "0x0250000000000937": 2,
    "0x025000000000093B": 2,
    "0x0250000000000933": 2,
    "0x0250000000000923": 2,
    "0x0250000000000944": 2,
    "0x0250000000000948": 2,
    "0x025000000000093F": 2,
    "0x0250000000000951": 2,
    "0x025000000000092D": 3,
    "0x0250000000000930": 3,
    "0x0250000000000934": 3,
    "0x0250000000000938": 3,
    "0x0250000000000940": 3,
    "0x0250000000000949": 3,
    "0x0250000000000952": 3,
    "0x025000000000094D": 3,
    "0x0250000000000945": 3,
    "0x025000000000093C": 3,
    "0x025000000000092E": 4,
    "0x0250000000000931": 4,
    "0x0250000000000935": 4,
    "0x025000000000093D": 4,
    "0x0250000000000946": 4,
    "0x025000000000094A": 4,
    "0x0250000000000953": 4,
    "0x025000000000094E": 4,
    "0x0250000000000939": 4,
    "0x0250000000000941": 4,
    "0x025000000000092F": 5,
    "0x0250000000000932": 5,
    "0x025000000000093E": 5,
    "0x0250000000000936": 5,
    "0x025000000000093A": 5,
    "0x0250000000000942": 5,
    "0x0250000000000947": 5,
    "0x025000000000094F": 5,
    "0x025000000000094B": 5,
    "0x0250000000000954": 5,
    "0x0250000000000956": 6, // Silver 6-11
    "0x025000000000095C": 6,
    "0x025000000000095D": 6,
    "0x025000000000095E": 6,
    "0x025000000000095F": 6,
    "0x0250000000000960": 6,
    "0x0250000000000961": 6,
    "0x0250000000000962": 6,
    "0x0250000000000963": 6,
    "0x0250000000000964": 6,
    "0x0250000000000957": 7,
    "0x0250000000000965": 7,
    "0x0250000000000966": 7,
    "0x0250000000000967": 7,
    "0x0250000000000968": 7,
    "0x0250000000000969": 7,
    "0x025000000000096A": 7,
    "0x025000000000096B": 7,
    "0x025000000000096C": 7,
    "0x025000000000096D": 7,
    "0x0250000000000958": 8,
    "0x025000000000096E": 8,
    "0x025000000000096F": 8,
    "0x0250000000000970": 8,
    "0x0250000000000971": 8,
    "0x0250000000000972": 8,
    "0x0250000000000973": 8,
    "0x0250000000000974": 8,
    "0x0250000000000975": 8,
    "0x0250000000000976": 8,
    "0x0250000000000959": 9,
    "0x0250000000000977": 9,
    "0x0250000000000978": 9,
    "0x0250000000000979": 9,
    "0x025000000000097A": 9,
    "0x025000000000097B": 9,
    "0x025000000000097C": 9,
    "0x025000000000097D": 9,
    "0x025000000000097E": 9,
    "0x025000000000097F": 9,
    "0x025000000000095A": 10,
    "0x0250000000000980": 10,
    "0x0250000000000981": 10,
    "0x0250000000000982": 10,
    "0x0250000000000983": 10,
    "0x0250000000000984": 10,
    "0x0250000000000985": 10,
    "0x0250000000000986": 10,
    "0x0250000000000987": 10,
    "0x0250000000000988": 10,
    "0x025000000000095B": 11,
    "0x0250000000000989": 11,
    "0x025000000000098A": 11,
    "0x025000000000098B": 11,
    "0x025000000000098C": 11,
    "0x025000000000098D": 11,
    "0x025000000000098E": 11,
    "0x025000000000098F": 11,
    "0x0250000000000991": 11,
    "0x0250000000000990": 11,
    "0x0250000000000992": 12, // Gold 12-17
    "0x0250000000000993": 12,
    "0x0250000000000994": 12,
    "0x0250000000000995": 12,
    "0x0250000000000996": 12,
    "0x0250000000000997": 12,
    "0x0250000000000998": 12,
    "0x0250000000000999": 12,
    "0x025000000000099A": 12,
    "0x025000000000099B": 12,
    "0x025000000000099C": 13,
    "0x025000000000099D": 13,
    "0x025000000000099E": 13,
    "0x025000000000099F": 13,
    "0x02500000000009A0": 13,
    "0x02500000000009A1": 13,
    "0x02500000000009A2": 13,
    "0x02500000000009A3": 13,
    "0x02500000000009A4": 13,
    "0x02500000000009A5": 13,
    "0x02500000000009A6": 14,
    "0x02500000000009A7": 14,
    "0x02500000000009A8": 14,
    "0x02500000000009A9": 14,
    "0x02500000000009AA": 14,
    "0x02500000000009AB": 14,
    "0x02500000000009AC": 14,
    "0x02500000000009AD": 14,
    "0x02500000000009AE": 14,
    "0x02500000000009AF": 14,
    "0x02500000000009B0": 15,
    "0x02500000000009B1": 15,
    "0x02500000000009B2": 15,
    "0x02500000000009B3": 15,
    "0x02500000000009B4": 15,
    "0x02500000000009B5": 15,
    "0x02500000000009B6": 15,
    "0x02500000000009B7": 15,
    "0x02500000000009B8": 15,
    "0x02500000000009B9": 15,
    "0x02500000000009BA": 16,
    "0x02500000000009BB": 16,
    "0x02500000000009BC": 16,
    "0x02500000000009BD": 16,
    "0x02500000000009BE": 16,
    "0x02500000000009BF": 16,
    "0x02500000000009C0": 16,
    "0x02500000000009C1": 16,
    "0x02500000000009C2": 16,
    "0x02500000000009C3": 16,
    "0x02500000000009C4": 17,
    "0x02500000000009C5": 17,
    "0x02500000000009C6": 17,
    "0x02500000000009C7": 17,
    "0x02500000000009C8": 17,
    "0x02500000000009C9": 17,
    "0x02500000000009CA": 17,
    "0x02500000000009CB": 17,
    "0x02500000000009CC": 17,
    "0x02500000000009CD": 17
}
module.exports = overwatch;