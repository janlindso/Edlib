<?php

namespace App\Listeners\Link;

use App\Events\LinkWasSaved;
use App\Libraries\Versioning\VersionableObject;
use App\Listeners\AbstractHandleVersioning;
use Cerpus\VersionClient\VersionClient;

class HandleVersioning extends AbstractHandleVersioning
{
    protected $versionClient;

    protected $link;

    public function __construct(VersionClient $versionClient)
    {
        $this->versionClient = $versionClient;
    }


    public function handle(LinkWasSaved $event)
    {
        $this->link = $event->link->fresh();

        $this->handleSave($this->link, $event->reason);
    }

    public function getParentVersionId()
    {
        return $this->link->version_id;
    }

    protected function getExternalUrl(VersionableObject $object)
    {
        return route('link.show', $object->getId());
    }
}
