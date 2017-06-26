<?php

namespace Calc\CalcBundle\Controller;
use Symfony\Component\HttpFoundation\{Request, Response};
use Calc\CalcBundle\Entity\Configurations;

class ConfigurationsController extends DefaultController
{
    public function getElements(): array
    {
        $result = [];
        $configurations = $this->getDoctrine()->getManager()->getRepository('CalcCalcBundle:Configurations');
        $list = $configurations->findAll();
        foreach ($list as $value)
        {
            $result[] = $value->getFields();
        }

        return $result;
    }

    public function listAction():Response
    {
        $result = ['error' => null, 'data' => null];
        try
        {
            $result['data'] = $this->getElements();
            return $this->toJson($result);
        }
        catch (\Exception $error)
        {
            print($error->getMessage());
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
            return $this->toJson($result);
        }
    }

    public function updateAction(Request $request):Response
    {
        $data = json_decode($request->request->get('data'));
        $manager = $this->getDoctrine()->getManager();
        $configurations = $manager->getRepository('CalcCalcBundle:Configurations');

        foreach($data as $id => $value)
        {
            $element = $configurations->find($id);
            if (!$element) {
                $element = new Configurations();
            }

            print_r($value);

            property_exists($value, 'name') && $element->setName($value->name);
            property_exists($value, 'label') && $element->setLabel($value->label);
            property_exists($value, 'elements') && $element->setElements($value->elements);

            $manager->persist($element);
        }

        $manager->flush();

        return $this->toJson(["data" => $configurations->findAll()]);
    }
}
