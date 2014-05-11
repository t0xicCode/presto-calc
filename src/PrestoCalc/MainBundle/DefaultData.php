<?php

namespace PrestoCalc\MainBundle;

use Symfony\Component\Yaml\Yaml;

class DefaultData
{

    /**
     * @var array
     */
    protected $data;

    /**
     * @return array
     */
    public function getData()
    {
        if (empty($this->data)) {
            $this->data = $this->yamlParse('data.yml');
        }

        return $this->data;
    }

    /**
     * Parse a YAML file from dataLocation root
     *
     * @param string $file
     * @return array
     */
    protected function yamlParse($file)
    {
        return Yaml::parse(__DIR__ . '/Resources/config/' . $file);
    }
} 
