<?php

namespace Calc\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function indexAction():Response
    {
        $request = $this->get('request');
        print('<pre>');
        print_r($request->attributes);
        print('</pre>');
        return $this->toJson();
    }

    public function toJson(array $data = []):Response
    {
        $response = new Response();

        $response->setStatusCode(empty($data['error']) ? 200 : $data['error']['code']);

        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('Content-Charset', 'utf-8');

        $response->setcontent(json_encode([
            "error" => empty($data['error']) ? null : $data['error']['message'],
            "data" => $data['data'] ?? null
        ]));

        return $response;
    }
}
