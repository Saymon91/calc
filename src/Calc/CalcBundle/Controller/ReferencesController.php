<?php
namespace Calc\CalcBundle\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Calc\CalcBundle\Entity\References;

class ReferencesController extends DefaultController
{
    public function getReferences(string $name = null): array
    {
        $result = [];
        $references = $this->getDoctrine()->getManager()->getRepository('CalcCalcBundle:References');
        $list = $name ? $references->findBy(['categories' => $name]) : $references->findAll();
        foreach ($list as $value)
        {
            $result[] = $value->getFields();
        }

        return $result;
    }

    public function showAction(string $name) {
        $result = ['error' => null, 'data' => null];
        try
        {

            $result['data'] = $this->getReferences($name);
            return $this->toJson($result);
        }
        catch (\Exception $error)
        {
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
            return $this->toJson($result);
        }
    }

    public function listAction():Response
    {
        $result = ['error' => null, 'data' => null];
        try
        {
            $result['data'] = $this->getReferences();
            return $this->toJson($result);
        }
        catch (\Exception $error)
        {
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
            return $this->toJson($result);
        }
    }

    public function updateAction(Request $request):Response
    {
        $data = json_decode($request->request->get('data'));
        $manager = $this->getDoctrine()->getManager();
        $references = $manager->getRepository('CalcCalcBundle:References');

        print_r($data);
        foreach ($data as $value)
        {
            $element = property_exists($value, 'id') ? $references->find($value->id) : new References();
            if (!$element) {
                $element = new References();
            }

            foreach (References::FIELDS as $key) {
                if (property_exists($value, $key)){
                    $setter = "set".ucfirst(str_replace('_', '', ucwords($key, '_')));
                    print($setter);
                    print('<br>');
                    if (method_exists($element, $setter)) {
                        $element->$setter($value->$key);
                    }

                }
            }

            $manager->persist($element);
        }

        $manager->flush();

        return $this->toJson(["data" => $references->findAll()]);
    }
}