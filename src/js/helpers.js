import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //   'https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=317be663&app_key=c395e973e7e3fcb958780bd6aa150dc5&diet=balanced&health=alcohol-free&cuisineType=American&mealType=Breakfast&mealType=Dinner&mealType=Lunch&mealType=Snack&mealType=Teatime&dishType=Main%20course&imageSize=REGULAR&random=false&field=uri&field=label&field=image&field=source&field=url&field=shareAs&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=glycemicIndex&field=totalCO2Emissions&field=co2EmissionsClass&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients&field=totalDaily&field=digest&field=tags'

    const data = await res.json();

    if (!res.ok) throw new Error(`${data[0].message} (${data[0].errorCode})`);

    return data;
  } catch (err) {
    throw err;
  }
};
/* 
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    //   'https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=317be663&app_key=c395e973e7e3fcb958780bd6aa150dc5&diet=balanced&health=alcohol-free&cuisineType=American&mealType=Breakfast&mealType=Dinner&mealType=Lunch&mealType=Snack&mealType=Teatime&dishType=Main%20course&imageSize=REGULAR&random=false&field=uri&field=label&field=image&field=source&field=url&field=shareAs&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=glycemicIndex&field=totalCO2Emissions&field=co2EmissionsClass&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients&field=totalDaily&field=digest&field=tags'

    const data = await res.json();

    if (!res.ok) throw new Error(`${data[0].message} (${data[0].errorCode})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadDate) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadDate),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //   'https://api.edamam.com/api/recipes/v2?type=public&beta=true&app_id=317be663&app_key=c395e973e7e3fcb958780bd6aa150dc5&diet=balanced&health=alcohol-free&cuisineType=American&mealType=Breakfast&mealType=Dinner&mealType=Lunch&mealType=Snack&mealType=Teatime&dishType=Main%20course&imageSize=REGULAR&random=false&field=uri&field=label&field=image&field=source&field=url&field=shareAs&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=glycemicIndex&field=totalCO2Emissions&field=co2EmissionsClass&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients&field=totalDaily&field=digest&field=tags'

    const data = await res.json();

    if (!res.ok) throw new Error(`${data[0].message} (${data[0].errorCode})`);

    return data;
  } catch (err) {
    throw err;
  }
};
 */
