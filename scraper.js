const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();

const feeds = [
    'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    'https://weworkremotely.com/categories/remote-front-end-programming-jobs.rss'
];

const keywords = ['AI', 'React', 'Python', 'Node', 'Machine Learning', 'Data', 'Web3', 'Remote'];

async function fetchJobs() {
    let jobs = [];
    
    for (let url of feeds) {
        try {
            let feed = await parser.parseURL(url);
            feed.items.forEach(item => {
                const isRelevant = keywords.some(kw => 
                    item.title.toLowerCase().includes(kw.toLowerCase()) || 
                    item.content.toLowerCase().includes(kw.toLowerCase())
                );

                if (isRelevant) {
                    jobs.push({
                        id: item.guid || item.id || Math.random().toString(36).substr(2, 9),
                        title: item.title,
                        company: item.creator || 'Azienda Tech',
                        link: item.link,
                        date: item.pubDate,
                        source: 'WeWorkRemotely'
                    });
                }
            });
        } catch (error) {
            console.error(`Errore con il feed ${url}:`, error);
        }
    }

    jobs.sort((a, b) => new Date(b.date) - new Date(a.date));
    jobs = jobs.slice(0, 50);

    fs.writeFileSync('./data/jobs.json', JSON.stringify(jobs, null, 2));
    console.log(`Aggiornamento completato. Trovati ${jobs.length} lavori.`);
}

fetchJobs();
