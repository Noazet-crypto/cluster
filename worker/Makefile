infra:
	terraform apply

job:
	nomad run -address http://172.20.0.10:4646/ $f

clean:
	curl -X PUT http://172.20.0.10:4646/v1/system/gc

reset:


kill:
	cd .. && vagrant halt --force

up:
	cd .. && vagrant up

commit:
	cd .. & git add .. && git commit -m '$c' && git push origin master
