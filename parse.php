<?php
ini_set('max_execution_time', 86400);
$dataCsvParse = file('C:\data\data.csv');
$dataFormat = [];
$cement = [];
$url = 'https://developcrmapp.firebaseio.com/';
$getDictionaryCement = json_decode(file_get_contents($url . 'dictionaryCement.json'), true);
$getObject = json_decode(file_get_contents($url . 'objects.json'), true);
$getProvider = json_decode(file_get_contents($url . 'providers.json'), true);

function getCement($cement, $getDictionaryCement) {
    foreach ($getDictionaryCement as $key => $value) {
        if ($value['name'] === trim(explode('.', $cement)[0])) {
            return $key;
        }
    }
}

function getCementPrice($cement, $getDictionaryCement) {
    foreach ($getDictionaryCement as $key => $value) {
        if ($value['name'] === trim(explode('.', $cement)[0])) {
            return $value['price'];
        }
    }
}

function getObject($object, $getObject, $provider) {
    foreach ($getObject as $key => $value) {
        if ($value['name'] === $object && $value['provider'] === $provider) {
            return $key;
        }
    }
}

function getProvider($provider, $getProvider) {
    foreach ($getProvider as $key => $value) {
        if ($value['name'] === $provider) {
            return $key;
        }
    }
}

foreach ($dataCsvParse as $dataCsv) {
    $tempData = explode(';', $dataCsv);
    $tempData[2] = str_replace(',', '.', str_replace(' ', '',  $tempData[2]));
    $tempData[3] = str_replace(',', '.', str_replace(' ', '',  $tempData[3]));
    $tempData[7] = trim(str_replace('  ', ' ',  $tempData[7]));
    if (empty($tempData[3])) {
        $price = (string) @(getCementPrice($tempData[1], $getDictionaryCement));
    } else {
        $price = (string) @($tempData[3]);
    }
    if (empty($tempData[3])) {
        $subTotal = (string) @(getCementPrice($tempData[1], $getDictionaryCement) * $tempData[2]);
    } else {
        $subTotal = (string) @($tempData[3] * $tempData[2]);
    }
    $dataFormat[] = [
        'period' =>  $tempData[0],
        'brandCement' =>  getCement($tempData[1], $getDictionaryCement),
        'volume' =>  $tempData[2],
        'pricePerOneTon' => $price,
        'comment' =>  $tempData[7],
        'availabilityOfDocuments' => (mb_strtolower($tempData[4]) === 'скан') ? '1' : (mb_strtolower($tempData[4]) === 'оригинал') ? '2' : '3',
        'isAccounting' =>  false,
        'delivery' =>  '',
        'plain' =>  '',
        'underloading' =>  '',
        'whoCompany' =>  '',
        'subTotal' => $subTotal,
        'object' => getObject($tempData[6], $getObject, getProvider($tempData[5], $getProvider)),
        'provider' => getProvider($tempData[5], $getProvider),
    ];
}
unset($dataFormat[0]);

//echo '<pre>';
//var_dump($dataFormat);
//echo '</pre>';

foreach($dataFormat as $data) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url . 'providersDataPayOff.json');
    curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
    $out = json_decode(curl_exec($curl));
    echo '<pre>';
    var_dump('name: ' . $out->name);
    echo '</pre>';
    curl_close($curl);
}