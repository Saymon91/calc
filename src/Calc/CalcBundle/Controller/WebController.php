<?php

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\{Request, Response};

class WebController extends ReferencesController
{
    public function indexAction():Response
    {
        $parameters = [];
        $references = $this->getReferences();
        $parameters['user'] = 'admin';

        return $this->render('CalcCalcBundle:Show:index.html.twig', $parameters, new Response(null, 200));
    }

    public function templatesAction(Request $request):Response
    {
        $query = $request->query->all();
        $names = explode(',', $query['name']);
        $templates = [];
        foreach ($names as $name) {
            $templates[$name] = $this->container->get('twig')->render("CalcCalcBundle:Show:{$name}.html.twig", ['user' => $query['user'] ?? 'admin']);
        }

        return $this->toJson(['data' => $templates]);
    }


};