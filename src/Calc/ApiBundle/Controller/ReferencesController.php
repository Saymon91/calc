<?php
namespace Calc\ApiBundle\Controller;

use Symfony\Component\HttpFoundation\{Request, Response};
use Calc\ApiBundle\Entity\References;

class ReferencesController extends DefaultController
{
    public function getReferences(string $name = null): array
    {
        $result = [];
        $references = $this->getDoctrine()->getManager()->getRepository('CalcApiBundle:References');
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
        }
        catch (\Exception $error)
        {
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
        }
        finally
        {
            return $this->toJson($result);
        }
    }

    public function listAction():Response
    {
        $result = ['error' => null, 'data' => null];
        try
        {
            $result['data'] = $this->getReferences();
        }
        catch (\Exception $error)
        {
            print($error->getMessage());
            $result['error'] = ['code' => 500, 'message' => 'Internal error'];
        }
        finally
        {
            return $this->toJson($result);
        }
    }

    public function add(array $item = []):References
    {
        $manager = $references = $this->getDoctrine()->getManager();
        $referenceItem = new References();
        foreach (References::FIELDS as $value)
        {
            if (isset($item[$value])) {
                $setter = "set".ucfirst($value);
                if (method_exists($referenceItem, $setter))
                {
                    $referenceItem->$setter($item[$value]);
                }
            }
        }

        print('<pre>');
        print_r($referenceItem->getFields());
        print('<pre>');

        $manager->persist($referenceItem);
        $manager->flush();

        print('<pre>');
        print_r($referenceItem->getFields());
        print('<pre>');

        return $referenceItem;
    }

    public function addAction(Request $request):Response
    {
        print('<pre>');
        print_r($request->request->all());
        print('</pre>');
        return $this->toJson([]);
    }
}