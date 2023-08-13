const handler = async (m, {conn, text, usedPrefix, command, isOwner}) => {
  if (!text) throw `numero non valido`;
  if (!text.match(/x/g)) throw `*Esempio :* ${usedPrefix + command} ${m.sender.split('@')[0]}x`;
  if (text.match(/x/g).length > 3 && !isOwner) throw `Troppe x !`;
  const detect = text.replace(/[^0-9|x]/g, '');
  if (detect.length < 5) throw `Hai inserito un numero inesistente`;
  await m.reply(wait);
  const data = await nowa(conn, detect);
  const txt = '\t*• 2009 - 2016 •*\n' + data.filter((v) => v.exists && !/Date/.test(v.setAt) && /09|1[0-6]$/.test(v.setAt))
      .map((v) => `Numero : @${splitM(v.jid)}\nBio : ${v.status || ''}\nData : ${v.setAt}`).join('\n\n') +
	'\n\n\t*• 2017 - ORA •*\n' + data.filter((v) => v.exists && /1[7-9]|2[0-2]$/.test(v.setAt))
      .map((v) => `@${splitM(v.jid)}`).join('\n') +
	'\n\n\t*• Data non Valida •*\n' + data.filter((v) => v.exists && /Date/.test(v.setAt))
      .map((v) => `@${splitM(v.jid)}`).join('\n');
  m.reply(txt, '', {mentions: data.map((x) => x.jid)});
};
handler.help = ['NowaOld'];
handler.tags = ['info'];
handler.command = /^nowaold$/i;
handler.limit = 3;

export default handler;

function splitM(num) {
  return num.split('@')[0];
}

function formatDate(n, locale = 'id') {
  n = +n;
  if (n == 0) n = NaN;
  const d = new Date(n);
  return d.toLocaleDateString(locale, {timeZone: 'Asia/Jakarta'});
}

export async function nowa(client, num) {
  const random = num.match(/x/g).length; const total = Math.pow(10, random); const arr = [];
  for (let i = 0; i < total; i++) {
    const list = [...i.toString().padStart(random, '0')]; const result = num.replace(/x/g, () => list.shift()) + '@s.whatsapp.net';
    if (await client.onWhatsApp(result).then((v) => (v[0] || {}).exists)) {
      const info = await client.fetchStatus(result).catch(() => {}) || {};
      info.setAt = formatDate(info?.setAt);
      arr.push({exists: true, jid: result, ...info});
    } else {
      arr.push({exists: false, jid: result});
    }
  }
  return arr;
}
