infra:
	terraform apply

job:
	nomad run -address http://172.20.0.10:4646/ $f

stop:
	nomad job stop $j

clean:
	curl -X PUT http://172.20.0.10:4646/v1/system/gc

reset:
	make stop j=Platform && make stop j=Engine && make stop j=Broker && make stop j=Cache make stop j=Database
	make clean

kill:
	cd .. && vagrant halt --force

up:
	cd .. && vagrant up

commit:
	cd .. & git add .. && git commit -m '$c' && git push origin master
